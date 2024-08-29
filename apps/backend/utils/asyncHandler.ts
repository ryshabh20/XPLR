import { NextFunction, Request, Response } from "express";

export const asyncHandler = (
  requestHanlder: (
    req: Request,
    res: Response,
    next: NextFunction
  ) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(requestHanlder(req, res, next)).catch((err) => next(err));
  };
};
