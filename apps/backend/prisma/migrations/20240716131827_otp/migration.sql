-- AlterTable
ALTER TABLE "user" ADD COLUMN     "otp" VARCHAR(45),
ADD COLUMN     "otp_expiration" TIMESTAMP(3);
