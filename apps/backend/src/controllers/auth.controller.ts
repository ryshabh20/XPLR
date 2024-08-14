import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { SendOtp } from "../../utils/send.otp";
import { oAuth2Client, redisClient } from "..";
import { errorHandler } from "../../utils/errorHandler";
import { generateNewTokens } from "../../utils/tokens";
import { HttpStatusCode } from "axios";

const checkUserExistence = async (
  identifier: string,
  field: "email" | "username",
  res: Response,
  next: NextFunction
) => {
  try {
    const user = await prisma.user.findUnique({
      where: { [field]: identifier } as { [K in typeof field]: string },
    });
    res.json({ exist: !!user });
  } catch (error) {
    next(error);
  }
};
export const UserNameChecker = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = req.query.email as string;
  const username = req.query.username as string;
  if (!email && !username) {
    errorHandler(
      HttpStatusCode.BadRequest,
      "please provide a valid username/email."
    );
  }
  if (email) {
    checkUserExistence(email, "email", res, next);
  }
  if (username) {
    checkUserExistence(username, "username", res, next);
  }
};

export const getUserDetails = async (idToken: string) => {
  const ticket = await oAuth2Client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (payload) {
    return {
      userId: payload.sub,
      email: payload.email,
      emailVerified: payload.email_verified,
      name: payload.name,
      givenName: payload.given_name,
      familyName: payload.family_name,
      picture: payload.picture,
    };
  }

  errorHandler(HttpStatusCode.BadRequest, "Unable to retrieve user details");
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
      errorHandler(
        HttpStatusCode.Conflict,
        "User with this email already exists"
      );
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

  const { tokens } = await oAuth2Client.getToken(code);

  if (!tokens) {
    errorHandler(HttpStatusCode.Unauthorized, "Please try to login again");
  } else {
    const user = await getUserDetails(tokens.id_token as string);
    const dbUser = await prisma.user.findUnique({
      where: {
        email: user?.email,
      },
    });

    if (user) {
      await prisma.user.create({
        data: {
          email: user?.email || "",
          fullname: user?.name || "",
          username: user?.email || "",
          refreshToken: tokens.refresh_token,
        },
      });
    }
    oAuth2Client.setCredentials(tokens);
    res.cookie("access_token", tokens.access_token);
    res.cookie("refresh_token", tokens.refresh_token);
    return res.json({ user, tokens });
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
    const [_, otpExpiration] = await redisClient.hmGet(email, [
      "otp",
      "otp_expiration",
    ]);
    if (!otpExpiration) {
      const isOTPSent = await SendOtp({ email });
      if (isOTPSent) {
        res.status(200).json({ message: "OTP sent successfully" });
      }
    }
    const previousExpiredTime =
      new Date(otpExpiration).getTime() - 9 * 60 * 1000;
    const currentTime = Date.now();
    const elapsedTime = (currentTime - previousExpiredTime) / 1000;
    if (elapsedTime < 60) {
      return res.status(HttpStatusCode.TooManyRequests).json({
        message: "Please wait 1 minute before sending out another OTP.",
      });
    }
    const isOTPSent = await SendOtp({ email });
    if (isOTPSent) {
      return res.status(200).json({ message: "OTP resent successfully" });
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
  try {
    const data = req.body.data;
    const otp = req.body.otp.otp;

    const [storedOtp, otpExpiration] = await redisClient.hmGet(data.email, [
      "otp",
      "otp_expiration",
    ]);

    if (!storedOtp || !otpExpiration) {
      await redisClient.del(data.email);
      errorHandler(403, "Please request a new OTP.");
    }

    const isExpired = Date.now() > new Date(otpExpiration).getTime();

    if (isExpired) {
      await redisClient.del(data.email);
      errorHandler(HttpStatusCode.Forbidden, "Please request a new OTP.");
    }
    if (storedOtp !== otp) {
      errorHandler(
        HttpStatusCode.BadRequest,
        "That code isn't valid. You can request a new one."
      );
    }
    const user = await prisma.user.create({
      data,
    });
    if (user) {
      res.status(200).json({
        message: "User Created Successfully",
      });
    }
  } catch (error: any) {
    next(error);
  }
};

export const Login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { email } = req.body.data;
    const pass = req.body.data.password;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || pass !== user.password) {
      errorHandler(HttpStatusCode.Unauthorized, "Invalid Credentials");
    }
    await generateNewTokens(email, res);
    return res.json({ message: "User Logged In" });
  } catch (error) {
    next(error);
  }
};

export const OauthGoogle = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // const fullUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

  // console.log("Full URL:", fullUrl);
  console.log("called");
  console.log("this is the req", req);
  console.log("this is the request query", req.query);
  console.log("this is the header", req.headers);
  return res.json({ message: "success" });
};
