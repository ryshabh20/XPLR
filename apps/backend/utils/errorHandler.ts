import { ApiError } from "../src/handlers/ApiError";

export const errorHandler = (
  statusCode: number,
  message: string,
  errors: string[] = [],
  stack: string = ""
) => {
  throw new ApiError(statusCode, message, errors, stack, true);
};
