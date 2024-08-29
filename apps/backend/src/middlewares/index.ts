import { NextFunction, Request, Response } from "express";
import { verfiyToken } from "../../utils/tokens";
import { access } from "fs";
import { user } from "@prisma/client";
import { errorHandler } from "../../utils/errorHandler";
import { HttpStatusCode } from "axios";
import { error } from "console";
declare global {
  namespace Express {
    interface Request {
      user: user;
    }
  }
}

export const AuthCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  const accessToken = cookies["access_token"];
  const user = await verfiyToken(accessToken);
  if (!user) {
    console.log("crashed here");
    return errorHandler(HttpStatusCode.Unauthorized, "Please login again");
  }
  req.user = user;
  next();
};
