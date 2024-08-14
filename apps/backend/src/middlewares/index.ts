import { NextFunction, Request, Response } from "express";
import { errorHandler } from "../../utils/errorHandler";
import { generateNewTokens } from "../../utils/tokens";

export const TokenValidator = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookies = req.cookies;
  const accessToken = cookies["access_token"];
  const refreshToken = cookies["refresh_token"];
  if (!accessToken || !refreshToken) {
    next(errorHandler(401, "unauthorized"));
  }
  if (!accessToken && refreshToken) {
    generateNewTokens(refreshToken, res);
  }

  next();
};
