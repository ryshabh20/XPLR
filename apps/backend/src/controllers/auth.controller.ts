import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { SendOtp } from "../../utils/send.otp";
import axios from "axios";
import { redisClient } from "..";

export const UserNameChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.query.email as string;
  const username = req.query.username as string;
  if (!email && !username) {
    res.json({
      message: "please provide a valid username/email.",
    });
  }
  if (email) {
    try {
      const user = await prisma.user.findUnique({ where: { email } });
      if (user) {
        res.json({ exist: true });
      } else {
        res.json({ exist: false });
      }
    } catch (error: any) {
      next(error);
    }
  } else if (username) {
    try {
      const user = await prisma.user.findUnique({ where: { username } });
      if (user) {
        res.json({ exists: true });
      } else {
        res.json({ exist: false });
      }
    } catch (error: any) {
      next(error);
    }
  }
};

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
    next(error);
  }
};

export const GoogleLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { code } = req.body;
  try {
    const { data } = await axios.post("<https://oauth2.googleapis.com/token>", {
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code,
      // redirect_uri: process.env.REDIRECT_URI,
      grant_type: "authorization_code",
    });
    console.log("data", data);
    return res.json({ message: "wohoo", data });
  } catch (error) {
    console.log("this is the error", error);
  }
};

export const OtpGenerator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const { email } = data;

  try {
    const isOtpExist = await redisClient.hmGet(email, [
      "otp",
      "otp_expiration",
    ]);
    if (isOtpExist[1]) {
      const previousExpiredTime = new Date(isOtpExist[1]).getTime();
      const currentTime = Date.now();
      const elapsedTime = currentTime - previousExpiredTime;
      console.log(elapsedTime);
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
    } else {
      const isOTPSent = await SendOtp({ email });
      if (isOTPSent) {
        res.status(200).json({ message: "OTP sent successfully" });
      }
    }
  } catch (error: any) {
    next(error);
  }
};

export const VerifyOtp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body);
  try {
    const body = req.body;
    const data = body.data;
    const otp = body.otp.otp;

    console.log("otp,data", otp, data);

    const redisUser = await redisClient.hmGet(data.email, [
      "otp",
      "otp_expiration",
    ]);
    const currentTime = Date.now();
    const previousExpiredTime = new Date(redisUser[1]).getTime();
    const elapsedTime = currentTime - previousExpiredTime > 300;
    console.log("this is the otp", otp, "this is the redisUser", redisUser[0]);
    if (!redisUser || elapsedTime) {
      await redisClient.del(data.email);
      res.status(200).json({ message: "Please request a new OTP." });
    } else if (redisUser[0] !== otp) {
      res
        .status(401)
        .json({ message: "That code isn't valid. You can request a new one." });
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
    console.log(error);
    next(error);
  }
};
