import dotenv from 'dotenv';
dotenv.config();

export const config = {
  port: parseInt(process.env.PORT || '3001', 10),
  redis: {
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379', 10),
  },
  elasticsearchUrl: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  workerConcurrency: parseInt(process.env.WORKER_CONCURRENCY || '5', 10),
  minDelayBetweenSendsMs: parseInt(process.env.MIN_DELAY_BETWEEN_SENDS_MS || '1000', 10),
  maxEmailsPerHourPerSender: parseInt(process.env.MAX_EMAILS_PER_HOUR_PER_SENDER || '10', 10),
  sessionSecret: process.env.SESSION_SECRET || 'secret',
  frontendUrl: process.env.FRONTEND_URL || 'http://localhost:3000',
  googleAuth: {
    clientID: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    callbackURL: '/auth/google/callback'
  },
  slackAuth: {
    clientID: process.env.SLACK_CLIENT_ID || '',
    clientSecret: process.env.SLACK_CLIENT_SECRET || '',
    callbackURL: '/auth/slack/callback'
  }
};
