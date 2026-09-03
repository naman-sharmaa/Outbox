import { Router } from 'express';
import { prisma } from '../services/db';
import { emailQueue } from '../services/queue';
import { esClient } from '../services/es';
import multer from 'multer';
import { parse } from 'csv-parse';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

const router = Router();
const upload = multer({ dest: 'uploads/' });

// Middleware to check auth
const requireAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: 'Unauthorized' });
};

router.use(requireAuth);

router.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

  const emails = new Set<string>();
  const fs = require('fs');

  fs.createReadStream(req.file.path)
    .pipe(parse({ columns: false, skip_empty_lines: true }))
    .on('data', (row: string[]) => {
      // Basic email extraction from first column, or try to match email regex
      for (const col of row) {
        const match = col.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
        if (match) {
          match.forEach(email => emails.add(email.toLowerCase()));
        }
      }
    })
    .on('end', () => {
      fs.unlinkSync(req.file!.path);
      const uniqueEmails = Array.from(emails);
      res.json({ count: uniqueEmails.length, emails: uniqueEmails });
    })
    .on('error', (err: any) => {
      res.status(500).json({ error: 'Failed to parse file' });
    });
});

router.post('/schedule', async (req, res) => {
  const { subject, body, recipients, startTime, delayBetweenEmailsMs, hourlyLimit } = req.body;
  const user = req.user as any;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: 'Recipients array is required' });
  }
  
  if (!subject || !body || !startTime) {
    return res.status(400).json({ error: 'Subject, body, and startTime are required' });
  }

  const startDate = new Date(startTime);
  const delayMs = delayBetweenEmailsMs || 0;

  try {
    const jobsData = recipients.map((recipient, index) => {
      const scheduledFor = new Date(startDate.getTime() + index * delayMs);
      const rowId = uuidv4();
      const jobId = crypto.createHash('sha256').update(rowId).digest('hex'); // deterministic jobId
      return {
        id: rowId,
        jobId,
        subject,
        body,
        recipient,
        status: 'scheduled',
        scheduledAt: scheduledFor,
        userId: user.id
      };
    });

    // Batch insert DB
    await prisma.$transaction(
      jobsData.map(job => prisma.emailJob.create({ data: job }))
    );

    // Add to Elasticsearch
    const esBody = jobsData.flatMap(job => [
      { index: { _index: 'email_jobs', _id: job.id } },
      {
        id: job.id,
        userId: user.id,
        subject: job.subject,
        body: job.body,
        recipient: job.recipient,
        status: job.status,
        scheduledAt: job.scheduledAt
      }
    ]);
    if (esBody.length > 0) {
      await esClient.bulk({ refresh: true, body: esBody }).catch(err => console.error('ES Index error', err));
    }

    // Fan out queue adds
    const queueJobs = jobsData.map(job => ({
      name: 'send-email',
      data: { rowId: job.id, hourlyLimit: hourlyLimit || null },
      opts: {
        jobId: job.jobId,
        delay: Math.max(0, job.scheduledAt.getTime() - Date.now()),
        removeOnComplete: true,
        removeOnFail: false
      }
    }));

    await emailQueue.addBulk(queueJobs);

    res.json({ success: true, count: jobsData.length });
  } catch (err) {
    console.error('Schedule error:', err);
    res.status(500).json({ error: 'Failed to schedule jobs' });
  }
});

router.get('/jobs', async (req, res) => {
  const user = req.user as any;
  const scheduled = await prisma.emailJob.findMany({
    where: { userId: user.id, status: 'scheduled' },
    orderBy: { scheduledAt: 'asc' },
    take: 100
  });
  
  const sent = await prisma.emailJob.findMany({
    where: { userId: user.id, status: { in: ['sent', 'failed'] } },
    orderBy: { sentAt: 'desc' },
    take: 100
  });

  res.json({ scheduled, sent });
});

router.get('/search', async (req, res) => {
  const user = req.user as any;
  const { q } = req.query;
  
  if (!q || typeof q !== 'string') {
    return res.json({ results: [] });
  }

  try {
    const result = await esClient.search({
      index: 'email_jobs',
      body: {
        query: {
          bool: {
            must: [
              { term: { userId: user.id } },
              {
                multi_match: {
                  query: q,
                  fields: ['subject', 'body', 'recipient']
                }
              }
            ]
          }
        }
      }
    });

    const hits = result.hits.hits.map((hit: any) => hit._source);
    res.json({ results: hits });
  } catch (err) {
    console.error('Search error:', err);
    res.status(500).json({ error: 'Search failed' });
  }
});

export default router;
