/*
  Warnings:

  - You are about to drop the column `verifiedDate` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "verifiedDate",
ADD COLUMN     "isVerified" BOOLEAN;
