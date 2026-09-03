import { Worker, Job } from 'bullmq';
import { connection, emailQueue } from './services/queue';
import { prisma } from './services/db';
import { config } from './config/env';
import nodemailer from 'nodemailer';
import { createClient } from 'redis';
import { notifySlack } from './services/slack';
import { esClient } from './services/es';
import crypto from 'crypto';

// Setup separate Redis client for rate limiting (INCR)
const redisClient = createClient({
  url: `redis://${config.redis.host}:${config.redis.port}`
});
redisClient.connect();

const worker = new Worker('email-queue', async (job: Job) => {
  const { rowId, hourlyLimit } = job.data;
  
  // 1. Atomic DB update
  const updatedJob = await prisma.emailJob.updateMany({
    where: { id: rowId, status: 'scheduled' },
    data: { status: 'processing' }
  });

  if (updatedJob.count === 0) {
    console.log(`Job ${rowId} is not in scheduled state. Skipping (idempotency hit).`);
    return;
  }

  const dbJob = await prisma.emailJob.findUnique({ where: { id: rowId }, include: { user: true } });
  if (!dbJob) return;

  const senderAccounts = await prisma.senderAccount.findMany({ where: { userId: dbJob.userId } });
  
  if (senderAccounts.length === 0) {
    await markJobFailed(rowId, 'No sender accounts available');
    return;
  }

  // Round robin assignment based on Job ID or simple math
  const senderIndex = dbJob.scheduledAt.getTime() % senderAccounts.length;
  const sender = senderAccounts[senderIndex];

  // 2. Rate limiting check
  const maxEmails = hourlyLimit || config.maxEmailsPerHourPerSender;
  const currentHour = new Date().toISOString().substring(0, 13); // yyyy-mm-ddThh
  const rateKey = `ratelimit:${sender.id}:${currentHour}`;

  const currentCount = await redisClient.incr(rateKey);
  if (currentCount === 1) {
    await redisClient.expire(rateKey, 3600); // 1 hour expiry
  }

  if (currentCount > maxEmails) {
    console.log(`Rate limit hit for sender ${sender.email}. Rescheduling.`);
    await redisClient.decr(rateKey); // Refund the slot
    
    // Reschedule to start of next hour
    const nextHour = new Date();
    nextHour.setUTCHours(nextHour.getUTCHours() + 1, 0, 0, 0);
    
    const newJobId = crypto.createHash('sha256').update(dbJob.id + nextHour.toISOString()).digest('hex');
    
    await prisma.emailJob.update({
      where: { id: rowId },
      data: { status: 'scheduled', scheduledAt: nextHour, jobId: newJobId }
    });

    await emailQueue.add('send-email', { rowId, hourlyLimit }, {
      jobId: newJobId,
      delay: nextHour.getTime() - Date.now(),
      removeOnComplete: true
    });

    // Notify slack
    if (dbJob.user.slackWebhookUrl) {
      await notifySlack(
        dbJob.user.slackWebhookUrl, 
        `Rate limit hit for sender ${sender.email}. Job for ${dbJob.recipient} rescheduled to ${nextHour.toISOString()}`
      );
    }
    return;
  }

  // 3. Send email via Ethereal
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
      user: sender.email,
      pass: sender.pass
    }
  });

  try {
    const info = await transporter.sendMail({
      from: `"ReachInbox" <${sender.email}>`,
      to: dbJob.recipient,
      subject: dbJob.subject,
      text: dbJob.body
    });

    console.log(`Email sent: ${info.messageId} - Preview: ${nodemailer.getTestMessageUrl(info)}`);

    await prisma.emailJob.update({
      where: { id: rowId },
      data: { status: 'sent', sentAt: new Date() }
    });

    // Update ES
    await esClient.update({
      index: 'email_jobs',
      id: rowId,
      body: { doc: { status: 'sent' } }
    }).catch(err => console.error('ES update error', err));

  } catch (err: any) {
    await markJobFailed(rowId, err.message);
  }

}, {
  connection,
  concurrency: config.workerConcurrency,
  limiter: {
    max: 1,
    duration: config.minDelayBetweenSendsMs
  }
});

async function markJobFailed(rowId: string, errorMsg: string) {
  await prisma.emailJob.update({
    where: { id: rowId },
    data: { status: 'failed', error: errorMsg, sentAt: new Date() }
  });
  await esClient.update({
    index: 'email_jobs',
    id: rowId,
    body: { doc: { status: 'failed' } }
  }).catch(err => console.error('ES update error', err));
}

worker.on('failed', (job, err) => {
  console.error(`Job ${job?.id} failed with ${err.message}`);
});

console.log(`Worker started with concurrency ${config.workerConcurrency}`);
