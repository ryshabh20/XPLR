import { ApiError } from "./ApiError";
import * as Sentry from "@sentry/node";
class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    console.log(
      "Error message from the centralized error-handling component",
      err
    );
    Sentry.captureException(err);
  }

  public isTrustedError(error: Error) {
    if (error instanceof ApiError) {
      console.log("this is the erro", error.isOperational);
      return error.isOperational;
    }
    console.log("false");
    return false;
  }
}
export const functionErrorHandler = new ErrorHandler();
