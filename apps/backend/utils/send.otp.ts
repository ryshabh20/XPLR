import prisma from "../prisma/prisma";
import { redisClient } from "../src";
import { sendEmail } from "./nodemailer";
import generateOTP from "./otp.generator";

export const SendOtp = async ({ email }: { email: string }) => {
  try {
    const otp = generateOTP();
    const subject = "Email Verification";
    const message = `Your OTP code is: ${otp}`;

    sendEmail(email, subject, message);
    const entryCreated = await redisClient.hSet(email, {
      otp,
      otp_expiration: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
    });
    // const updatedUser = await prisma.user.update({
    //   where: { email },
    //   data: {
    //     otp,
    //     otp_expiration: new Date(Date.now() + 10 * 60 * 1000),
    //   },
    // });
    return true;
  } catch (error: any) {
    throw new Error(error);
  }
};
