import { NextFunction, Request, Response } from "express";
import { decodeAccessToken } from "../../utils/tokens";
import prisma from "../../prisma/prisma";
import { HttpStatusCode } from "axios";
import { errorHandler } from "../../utils/errorHandler";
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

export const GetUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const tokenUser = decodeAccessToken(req.cookies["access_token"]);
  const user = await prisma.user.findUnique({
    where: {
      id: tokenUser.id,
    },
  });
  return res.status(HttpStatusCode.Ok).json({
    user,
  });
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

export const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const search = req.body.text as string;
  const userId = req.user?.id;
  const users = await prisma.user.findMany({
    where: {
      username: { contains: search, mode: "insensitive" },
      id: { not: userId },
    },

    select: {
      fullname: true,
      username: true,
      avatar: true,
      id: true,
    },
  });

  res
    .status(HttpStatusCode.Ok)
    .json({ message: "All users fetched", data: users });
};
