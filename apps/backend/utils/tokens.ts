import jwt from "jsonwebtoken";
import prisma from "../prisma/prisma";
import { Response } from "express";
import { errorHandler } from "./errorHandler";
export const generateNewTokens = async (email: string, res: Response) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return errorHandler(401, "User does not Exists");
  const { password, ...userWithoutPass } = user;
  const token = jwt.sign({ userWithoutPass }, process.env.JWT_SECRET as string);

  const refreshToken = jwt.sign(
    { email },
    process.env.REFRESH_SECRET as string
  );
  const updatedUser = await prisma.user.update({
    where: { id: user.id },
    data: { refreshToken },
  });
  res.cookie("access_token", token, {
    httpOnly: true,
    expires: new Date(Date.now() + 10 * 60 * 1000),
  });
  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  });
};
