/*
  Warnings:

  - You are about to drop the column `verifedDate` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "verifedDate",
ADD COLUMN     "verifiedDate" TIMESTAMP(3);
