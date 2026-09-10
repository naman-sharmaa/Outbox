import { Client } from "@elastic/elasticsearch";
import { config } from "../config/env";

export const esClient = new Client({
  node: config.elasticsearchUrl,
});

export const setupElasticsearch = async () => {
  try {
    const exists = await esClient.indices.exists({ index: "email_jobs" });
    if (!exists) {
      await esClient.indices.create({
        index: "email_jobs",
        mappings: {
          properties: {
            id: { type: "keyword" },
            userId: { type: "keyword" },
            subject: { type: "text" },
            body: { type: "text" },
            recipient: { type: "text" },
            status: { type: "keyword" },
            scheduledAt: { type: "date" },
          },
        },
      });
      console.log("Elasticsearch index email_jobs created");
    }
  } catch (err) {
    console.error("Error setting up Elasticsearch:", err);
  }
};
