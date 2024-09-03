import jwt, { JwtPayload } from "jsonwebtoken";
import prisma from "../prisma/prisma";
import { NextFunction, Request, Response } from "express";
import { errorHandler } from "./errorHandler";
import { HttpStatusCode } from "axios";

interface MyJWTPayload extends JwtPayload {
  id: string;
  isLoggedInWithGoogle?: boolean;
}
export const generateAccessToken = (
  id: string,
  isLoggedInWithGoogle: boolean
): string => {
  const token = jwt.sign(
    { id, isLoggedInWithGoogle },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "10m",
    }
  );
  return token;
};
export const generateRefreshToken = (
  id: string,
  isLoggedInWithGoogle: boolean
): string => {
  const refreshToken = jwt.sign(
    { id, isLoggedInWithGoogle },
    process.env.REFRESH_SECRET as string,
    {
      expiresIn: "30d",
    }
  );
  return refreshToken;
};

export const generateNewTokens = async (email: string, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
    },
  });

  if (!user) return errorHandler(401, "User does not Exists");
  const accessToken = generateAccessToken(user.id, false);
  const refreshToken = generateRefreshToken(user.id, false);

  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 60 * 1000),
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};

export const generateNewAccessToken = async (
  id: string,
  refreshTokenFromRequest: string,
  res: Response
) => {
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, refreshToken: true },
  });
  if (!user) return errorHandler(401, "User does not Exists");

  const accessToken = generateAccessToken(user.id, false);

  if (user.refreshToken !== refreshTokenFromRequest) {
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { refreshToken: null },
    });
    errorHandler(HttpStatusCode.Unauthorized, "Please login again");
  }
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 60 * 1000),
  });
};

export const verfiyToken = async (accessToken: string) => {
  if (!accessToken) {
    errorHandler(HttpStatusCode.Unauthorized, "Please Login Again");
  }
  const user = decodeAccessToken(accessToken);
  if (!user.id) errorHandler(HttpStatusCode.Unauthorized, "Please Login Again");

  const userExistInDB = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
  });
  if (!userExistInDB) {
    errorHandler(HttpStatusCode.Unauthorized, "Please Login Again");
  }
  return userExistInDB;
};

export const RefreshToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const refreshToken = req.cookies["refresh_token"];

  const user = decodeRefreshToken(refreshToken);

  // if (user.isLoggedInWithGoogle) {
  //   refreshGoogleAccessToken(refreshToken);
  //   res
  //     .status(HttpStatusCode.Ok)
  //     .json({ message: "Revalidated the access token" });
  // }

  await generateNewAccessToken(user.id, refreshToken, res);
  res.sendStatus(HttpStatusCode.Ok);
};

export const decodeRefreshToken = (refreshToken: string) => {
  try {
    const user: any = jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET as string
    );

    return user;
  } catch (error) {
    errorHandler(
      HttpStatusCode.Unauthorized,
      "Refresh Token has been tampered with so please login again."
    );
  }
};
export const decodeAccessToken = (accessToken: string) => {
  const user: any = jwt.verify(
    accessToken,
    process.env.JWT_SECRET as string,
    (err, user) => {
      if (err) {
        errorHandler(
          HttpStatusCode.Unauthorized,
          "Access token has been tampered with please login again"
        );
      }
      return user;
    }
  );

  return user;
};
