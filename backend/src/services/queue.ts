import { Queue } from "bullmq";
import { config } from "../config/env";

export const connection = {
  host: config.redis.host,
  port: config.redis.port,
};

export const emailQueue = new Queue("email-queue", { connection });
