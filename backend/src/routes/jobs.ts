import { Router } from "express";
import { prisma } from "../services/db";
import { emailQueue } from "../services/queue";
import { esClient } from "../services/es";
import multer from "multer";
import { parse } from "csv-parse";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";

const router = Router();
const upload = multer({ dest: "uploads/" });

// Middleware to check auth
const requireAuth = (req: any, res: any, next: any) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Unauthorized" });
};

router.use(requireAuth);

router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });

  const fs = require("fs");

  try {
    const content = fs.readFileSync(req.file.path, "utf8");
    const emails = new Set<string>();

    const matches = content.match(
      /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi,
    );
    if (matches) {
      matches.forEach((email: string) => emails.add(email.toLowerCase()));
    }

    if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);

    const uniqueEmails = Array.from(emails);
    res.json({ count: uniqueEmails.length, emails: uniqueEmails });
  } catch (err) {
    console.error("Upload parse error:", err);
    if (fs.existsSync(req.file!.path)) fs.unlinkSync(req.file!.path);
    res.status(500).json({ error: "Failed to parse file" });
  }
});

router.post("/schedule", async (req, res) => {
  const {
    subject,
    body,
    sequences,
    recipients,
    startTime,
    delayBetweenEmailsMs,
    hourlyLimit,
  } = req.body;
  const user = req.user as any;

  if (!recipients || !Array.isArray(recipients) || recipients.length === 0) {
    return res.status(400).json({ error: "Recipients array is required" });
  }

  // Support old format or new sequences format
  const steps = sequences || [{ subject, body, delayDays: 0 }];

  if (!steps[0].subject || !steps[0].body || !startTime) {
    return res
      .status(400)
      .json({ error: "Subject, body, and startTime are required" });
  }

  const startDate = new Date(startTime);
  const delayMs = delayBetweenEmailsMs || 0;
  const campaignId = uuidv4();

  try {
    const jobsData: any[] = [];

    recipients.forEach((recipient, index) => {
      // Base time for this recipient based on queue delay
      const baseRecipientTime = new Date(startDate.getTime() + index * delayMs);

      steps.forEach((step: any, stepIndex: number) => {
        // Add step delay days
        const scheduledFor = new Date(
          baseRecipientTime.getTime() +
            (step.delayDays || 0) * 24 * 60 * 60 * 1000,
        );
        const rowId = uuidv4();
        const jobId = crypto.createHash("sha256").update(rowId).digest("hex");

        jobsData.push({
          id: rowId,
          jobId,
          campaignId,
          stepIndex,
          subject: step.subject,
          body: step.body,
          recipient,
          status: "scheduled",
          scheduledAt: scheduledFor,
          userId: user.id,
        });
      });
    });

    // Batch insert DB
    await prisma.$transaction(
      jobsData.map((job) => prisma.emailJob.create({ data: job })),
    );

    // Add to Elasticsearch
    const esBody = jobsData.flatMap((job) => [
      { index: { _index: "email_jobs", _id: job.id } },
      {
        id: job.id,
        userId: user.id,
        subject: job.subject,
        body: job.body,
        recipient: job.recipient,
        status: job.status,
        scheduledAt: job.scheduledAt,
      },
    ]);
    if (esBody.length > 0) {
      await esClient
        .bulk({ refresh: true, body: esBody })
        .catch((err) => console.error("ES Index error", err));
    }

    // Fan out queue adds
    const queueJobs = jobsData.map((job) => ({
      name: "send-email",
      data: { rowId: job.id, hourlyLimit: hourlyLimit || null },
      opts: {
        jobId: job.jobId,
        delay: Math.max(0, job.scheduledAt.getTime() - Date.now()),
        removeOnComplete: true,
        removeOnFail: false,
      },
    }));

    await emailQueue.addBulk(queueJobs);

    res.json({ success: true, count: jobsData.length, campaignId });
  } catch (err) {
    console.error("Schedule error:", err);
    res.status(500).json({ error: "Failed to schedule jobs" });
  }
});

router.get("/jobs", async (req, res) => {
  const user = req.user as any;
  const scheduled = await prisma.emailJob.findMany({
    where: { userId: user.id, status: "scheduled" },
    orderBy: { scheduledAt: "asc" },
    take: 100,
  });

  const sent = await prisma.emailJob.findMany({
    where: { userId: user.id, status: { in: ["sent", "failed"] } },
    orderBy: { sentAt: "desc" },
    take: 100,
  });

  res.json({ scheduled, sent });
});

router.get("/search", async (req, res) => {
  const user = req.user as any;
  const { q } = req.query;

  if (!q || typeof q !== "string") {
    return res.json({ results: [] });
  }

  try {
    const result = await esClient.search({
      index: "email_jobs",
      body: {
        query: {
          bool: {
            must: [
              { term: { userId: user.id } },
              {
                multi_match: {
                  query: q,
                  fields: ["subject", "body", "recipient"],
                },
              },
            ],
          },
        },
      },
    });

    const hits = result.hits.hits.map((hit: any) => hit._source);
    res.json({ results: hits });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ error: "Search failed" });
  }
});

router.delete("/jobs/:id", async (req, res) => {
  const user = req.user as any;
  const { id } = req.params;

  try {
    const job = await prisma.emailJob.findUnique({ where: { id } });
    if (!job || job.userId !== user.id) {
      return res.status(404).json({ error: "Job not found" });
    }

    if (job.status !== "scheduled") {
      return res.status(400).json({ error: "Can only cancel scheduled jobs" });
    }

    await prisma.emailJob.update({
      where: { id },
      data: { status: "cancelled" },
    });

    // Also update ES so search is accurate
    await esClient
      .update({
        index: "email_jobs",
        id,
        body: { doc: { status: "cancelled" } },
      })
      .catch((err) => console.error("ES update error", err));

    res.json({ success: true });
  } catch (err) {
    console.error("Cancel error:", err);
    res.status(500).json({ error: "Failed to cancel job" });
  }
});

export default router;
