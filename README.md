# ReachInbox Email Job Scheduler

Full-stack hiring assignment for ReachInbox.ai.

## Architecture & Features
- **Backend**: Node.js + Express.js + BullMQ + Prisma + PostgreSQL + Redis + Elasticsearch.
- **Frontend**: Next.js (App Router) + Tailwind CSS + React Three Fiber.
- **Scheduling**: Completely cron-free. Built heavily using BullMQ delayed jobs. Idempotent queue adds based on hash of job ID.
- **Restart Persistence**: Node processes can be restarted safely without losing scheduled emails. On startup, the backend runs a reconciliation pass to re-queue any database records that are `scheduled` but missing in the queue (or stuck).
- **Idempotency**: Atomic `updateMany` in Postgres limits exactly-once delivery in case BullMQ processes duplicate events.
- **Rate Limiting**: Worker limits to `1` email per `MIN_DELAY_BETWEEN_SENDS_MS`. An hourly bucketed rate limit is implemented via Redis `INCR`. If hit, the job is bumped to the start of the next hour.
- **Slack Notify**: Authentic OAuth v2 app integration posts to an Incoming Webhook when a rate limit is hit.
- **Ethereal Mail**: Setup uses Nodemailer with round-robin sender assignment.
- **Frontend UI**: Plumb base colors with Space Grotesk/Inter. The landing page features an interactive 3D particle orbit of scheduled tasks using React Three Fiber.

## Setup Instructions

### 1. Environment Configuration

You must supply your own Google OAuth and Slack OAuth credentials.

**Backend (`backend/.env`):**
```
DATABASE_URL="postgresql://reachinbox_user:reachinbox_password@localhost:5432/reachinbox?schema=public"
REDIS_HOST="localhost"
REDIS_PORT=6379
ELASTICSEARCH_URL="http://localhost:9200"

PORT=3001
WORKER_CONCURRENCY=5
MIN_DELAY_BETWEEN_SENDS_MS=1000
MAX_EMAILS_PER_HOUR_PER_SENDER=10
SESSION_SECRET="your_session_secret"
FRONTEND_URL="http://localhost:3000"

# Fill these in:
GOOGLE_CLIENT_ID="<your_google_client_id>"
GOOGLE_CLIENT_SECRET="<your_google_client_secret>"

SLACK_CLIENT_ID="<your_slack_client_id>"
SLACK_CLIENT_SECRET="<your_slack_client_secret>"
```

**Frontend (`frontend/.env.local`):**
```
NEXT_PUBLIC_API_URL="http://localhost:3001"
```

### 2. Infrastructure (Docker)

Start Redis, Postgres, and Elasticsearch:
```bash
docker compose up -d
```

### 3. Backend Setup

```bash
cd backend
npm install
npx prisma migrate dev --name init
npm run build
```

Run API and worker (separately or together via PM2/concurrently, but for dev we use `npm run dev` and `npm run worker`):
```bash
# Terminal 1
npm run dev

# Terminal 2
npm run worker
```

**Note**: To test sending, you must manually populate the `SenderAccount` table in Postgres with an Ethereal email and password tied to your `userId` (after you first login).

### 4. Frontend Setup

```bash
cd frontend
npm install
npm run build
npm start # or npm run dev
```

## Features vs Requirements Checklist

- [x] No cron, anywhere
- [x] Restart-safe (startup reconciliation pass)
- [x] Idempotent sends (deterministic jobId & atomic DB update)
- [x] Scheduler API (delay, batch DB transaction, fan-out queue adds)
- [x] Multi-sender Ethereal round-robin
- [x] Elasticsearch job index & search
- [x] Live BullMQ dashboard (`/admin/queues`)
- [x] Configurable concurrency & minimum delay
- [x] Emails/hour rate limit per sender (Redis INCR) & Slack notify
- [x] Real Slack OAuth v2 integration
- [x] Google OAuth login
- [x] CSV/text lead upload endpoint
- [x] 1000+ jobs batch handling
- [x] Deep plum-navy palette, R3F hero scene

## Trade-offs & Assumptions
- **ES Refresh**: Setting `refresh: true` on Elasticsearch bulk operations for immediate search visibility in dev. Might affect performance at huge scale.
- **Ethereal seeding**: Left to be done manually via DB insert since Ethereal credentials are required to send. A real setup would have a UI for users to link accounts.
- **Elasticsearch indexing**: Simplified mapping, using the backend to push updates synchronously after DB updates. Outbox pattern/CDC (like Debezium) would be more reliable in production.

