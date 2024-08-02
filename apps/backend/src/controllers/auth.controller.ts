import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { SendOtp } from "../../utils/send.otp";
import { redisClient } from "..";

export const usernameChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {};

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const { username, email } = data;

  try {
    const isUserExist = await prisma.user.findFirst({
      where: { OR: [{ email }, { username }] },
    });
    if (isUserExist) {
      res.status(401).json({
        message: "User with this email already exists",
      });
    } else {
      const user = await prisma.user.create({
        data,
      });
      if (user) {
        res.status(200).json({
          message: "User Created Successfully",
        });
      }
    }
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({
      error,
    });
  }
};

export const OtpGenerator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const { email } = data;
  console.log(email);

  try {
    const isOtpExist = await redisClient.hmGet(email, [
      "otp",
      "otp_expiration",
    ]);
    if (isOtpExist[1]) {
      const previousExpiredTime = new Date(isOtpExist[1]).getTime();
      const currentTime = Date.now();
      const elapsedTime = currentTime - previousExpiredTime;
      if (elapsedTime < 60) {
        res.status(200).json({
          message: "Please wait 1 minute before sending out another otp",
        });
      } else {
        const isOTPSent = await SendOtp({ email });
        if (isOTPSent) {
          res.status(200).json({ message: "OTP resent successfully" });
        }
      }
    }
    const isOTPSent = await SendOtp({ email });
    if (isOTPSent) {
      res.status(200).json({ message: "OTP sent successfully" });
    }
  } catch (error: any) {
    console.log("error", error);
    res.status(400).json({
      error,
    });
  }
};

export const VerifyOtp = async (req: Request, res: Response) => {
  console.log(req.body);
  try {
    const { otp, data } = req.body;

    const redisUser = await redisClient.hmGet(data.email, [
      "otp",
      "otp_expiration",
    ]);
    const currentTime = Date.now();
    const previousExpiredTime = new Date(redisUser[1]).getTime();
    const elapsedTime = currentTime - previousExpiredTime > 300;
    if (!redisUser || elapsedTime) {
      await redisClient.del(data.email);
      res.status(200).json({ message: "Please request a new OTP." });
    } else if (redisUser[0] !== otp) {
      res.status(401).json({ message: "Please enter the correct OTP." });
    } else {
      const user = await prisma.user.create({
        data,
      });
      if (user) {
        res.status(200).json({
          message: "User Created Successfully",
        });
      }
    }
  } catch (error: any) {
    res.status(400).json({
      error,
    });
  }
};
