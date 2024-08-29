/*
  Warnings:

  - You are about to drop the column `body` on the `message` table. All the data in the column will be lost.
  - The primary key for the `participant` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `participant` table. All the data in the column will be lost.
  - You are about to drop the column `participantId` on the `participant` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[latestId]` on the table `message` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `creatorId` to the `conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `conversation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `isRead` to the `message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `conversationId` to the `participant` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "participant" DROP CONSTRAINT "participant_participantId_fkey";

-- AlterTable
ALTER TABLE "conversation" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "creatorId" TEXT NOT NULL,
ADD COLUMN     "isGroup" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "title" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "message" DROP COLUMN "body",
ADD COLUMN     "content" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "isRead" BOOLEAN NOT NULL,
ADD COLUMN     "latestId" TEXT,
ADD COLUMN     "mediaUrl" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "participant" DROP CONSTRAINT "participant_pkey",
DROP COLUMN "id",
DROP COLUMN "participantId",
ADD COLUMN     "conversationId" TEXT NOT NULL,
ADD COLUMN     "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD CONSTRAINT "participant_pkey" PRIMARY KEY ("conversationId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "message_latestId_key" ON "message"("latestId");

-- AddForeignKey
ALTER TABLE "message" ADD CONSTRAINT "message_latestId_fkey" FOREIGN KEY ("latestId") REFERENCES "conversation"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "participant" ADD CONSTRAINT "participant_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "conversation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
