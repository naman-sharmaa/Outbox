import express from 'express';
import session from 'express-session';
import passport from 'passport';
import cors from 'cors';
import { config } from './config/env';
import authRoutes from './routes/auth';
import jobRoutes from './routes/jobs';
import { setupElasticsearch } from './services/es';
import { createBullBoard } from '@bull-board/api';
import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
import { ExpressAdapter } from '@bull-board/express';
import { emailQueue } from './services/queue';
import { prisma } from './services/db';

const app = express();

app.use(cors({
  origin: config.frontendUrl,
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: config.sessionSecret,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production', httpOnly: true },
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Bull Board setup
const serverAdapter = new ExpressAdapter();
serverAdapter.setBasePath('/admin/queues');
createBullBoard({
  queues: [new BullMQAdapter(emailQueue)],
  serverAdapter,
});

app.use('/admin/queues', serverAdapter.getRouter());
app.use('/auth', authRoutes);
app.use('/api', jobRoutes);

// Startup reconciliation pass
async function reconcileJobs() {
  console.log('Running startup reconciliation pass...');
  const stuckJobs = await prisma.emailJob.findMany({
    where: { status: 'scheduled' }
  });

  if (stuckJobs.length > 0) {
    const queueJobs = stuckJobs.map(job => ({
      name: 'send-email',
      data: { rowId: job.id, hourlyLimit: null },
      opts: {
        jobId: job.jobId, // Idempotent
        delay: Math.max(0, job.scheduledAt.getTime() - Date.now()),
        removeOnComplete: true,
      }
    }));
    await emailQueue.addBulk(queueJobs);
    console.log(`Reconciled ${queueJobs.length} jobs.`);
  }
}

app.listen(config.port, async () => {
  console.log(`Server running on port ${config.port}`);
  await setupElasticsearch();
  await reconcileJobs();
});
