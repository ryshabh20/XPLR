/*
  Warnings:

  - You are about to drop the column `latestId` on the `message` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[latestMessageId]` on the table `message` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "message" DROP CONSTRAINT "message_latestId_fkey";

-- DropIndex
DROP INDEX "message_latestId_key";

-- AlterTable
ALTER TABLE "message" DROP COLUMN "latestId",
ADD COLUMN     "latestMessageId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "message_latestMessageId_key" ON "message"("latestMessageId");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_latestMessageId_fkey" FOREIGN KEY ("latestMessageId") REFERENCES "conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
