/*
  Warnings:

  - You are about to drop the column `otp` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `otp_expiration` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "user" DROP COLUMN "otp",
DROP COLUMN "otp_expiration",
ADD COLUMN     "isGoogleAuthenticated" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "refreshToken" TEXT;
