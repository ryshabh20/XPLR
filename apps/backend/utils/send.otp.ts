import prisma from "../prisma/prisma";
import { redisClient } from "../src";
import { sendEmail } from "./nodemailer";
import generateOTP from "./otp.generator";

export const SendOtp = async ({ email }: { email: string }) => {
  try {
    const otp = generateOTP();
    console.log("this the otp", otp);
    const subject = "Email Verification";
    const message = `Your OTP code is: ${otp}`;

    sendEmail(email, subject, message);
    const entryCreated = await redisClient.hSet(email, {
      otp,
      otp_expiration: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      updatedAt: new Date(Date.now()).toISOString(),
    });
    return true;
  } catch (error: any) {
    throw new Error(error);
  }
};
