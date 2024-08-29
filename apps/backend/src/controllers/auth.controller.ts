import { NextFunction, Request, Response } from "express";
import prisma from "../../prisma/prisma";
import { SendOtp } from "../../utils/send.otp";
import { oAuth2Client, redisClient } from "..";
import { errorHandler } from "../../utils/errorHandler";
import { decodeAccessToken, generateNewTokens } from "../../utils/tokens";
import { HttpStatusCode } from "axios";

export const getUserDetails = async (idToken: string) => {
  const ticket = await oAuth2Client.verifyIdToken({
    idToken,
    audience: process.env.CLIENT_ID,
  });

  const payload = ticket.getPayload();
  if (!payload) {
    errorHandler(HttpStatusCode.BadRequest, "Unable to retrieve user details");
    return;
  }
  return {
    userId: payload.sub,
    email: payload.email,
    emailVerified: payload.email_verified,
    name: payload.name,
    givenName: payload.given_name,
    familyName: payload.family_name,
    picture: payload.picture,
  };
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
  }
  const user = await getUserDetails(tokens.id_token as string);
  if (!user) {
    errorHandler(
      HttpStatusCode.Unauthorized,
      "Please check with your Provider or try to login again"
    );
  }

  if (!user) {
    errorHandler(
      HttpStatusCode.Unauthorized,
      "Please check with your Provider or try to login again"
    );
  }
  await prisma.user.upsert({
    where: {
      email: user?.email,
    },
    update: {
      fullname: user?.name || "",
    },
    create: {
      email: user?.email || "",
      fullname: user?.name || "",
      username: user?.email || "",
    },
  });
  oAuth2Client.setCredentials(tokens);
  await generateNewTokens(user?.email as string, res);
  return res.json({ user });
};

// export const refreshGoogleAccessToken = async (refresh_token: string) => {
//   const credentials = oAuth2Client.setCredentials({
//     refresh_token,
//   });
//   const refreshedAccessToken = await oAuth2Client.refreshAccessToken();
// };
export const OtpGenerator = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const data = req.body;
  const { email } = data;

  try {
    const [_, otpExpiration, updatedAt] = await redisClient.hmGet(email, [
      "otp",
      "otp_expiration",
      "updatedAt",
    ]);
    if (!otpExpiration) {
      const isOTPSent = await SendOtp({ email });
      if (isOTPSent) {
        res.status(200).json({ message: "OTP sent successfully" });
      }
    }
    const previousExpiredTime = new Date(updatedAt).getTime();
    const currentTime = Date.now();
    const elapsedTime = (currentTime - previousExpiredTime) / 1000;

    if (elapsedTime < 1) {
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

export const logout = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    res.status(200).json("User has been logged out!");
  } catch (error) {
    next(error);
  }
};
