import { Request, Response, NextFunction } from "express";
import ErrorUtils from "../utils/error/ErrorUtils";
import { AppError } from "../lib";

const errorController = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = ErrorUtils.destructureError(err);

  if (error.name === "CastError") error = ErrorUtils.handleDBCastError(error);
  if (error.name === "ValidationError")
    error = ErrorUtils.handleDBValidationError(error);
  if (error.code === 11000)
    error = ErrorUtils.handleDBDuplicateFieldError(error);

  if (process.env.NODE_MODE === "PROD") {
    ErrorUtils.sendProductionError(res, error);
  } else {
    ErrorUtils.sendDevelopmentError(res, error);
  }
};

export default errorController;
