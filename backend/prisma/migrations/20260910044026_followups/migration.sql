-- AlterTable
ALTER TABLE "EmailJob" ADD COLUMN     "campaignId" TEXT,
ADD COLUMN     "stepIndex" INTEGER NOT NULL DEFAULT 0;
