import { Error as MongooseError } from "mongoose";
import { Response } from "express";
import { AppError } from "../../lib";

class ErrorUtils extends MongooseError {
  destructureError(err: any) {
    let error = { ...err };

    error.stack = err.stack;
    error.status = err.status || "error";
    error.statusCode = err.statusCode || 500;
    error.message = err.message || "Server Error";
    error.name = err.name;

    return error;
  }

  // _id error
  handleDBCastError(error: MongooseError.CastError) {
    const message = `Invalid ${error.path}:${error.value}`;
    return new AppError(400, message);
  }

  handleDBValidationError(error: MongooseError.ValidationError) {
    const errors = error.errors;

    const invalidInputs = Object.values(errors).map((err) => err.message);

    const message = `Invalid input data. ${invalidInputs.join(". ")}`;

    return new AppError(400, message);
  }

  handleDBDuplicateFieldError(error: any) {
    const keyValue = error?.keyValue;
    const [key, value] = Object.entries(keyValue)?.[0];

    const message = `Duplicate ${key} field value:${value}. Please use another ${key}.`;

    return new AppError(400, message);
  }

  sendDevelopmentError(res: Response, error: AppError) {
    res.status(error.statusCode).json({
      status: error.status,
      message: error.message,
      error,
      stack: error.stack,
    });
  }

  sendProductionError(res: Response, error: AppError) {
    if (error.isOperational)
      res.status(error.statusCode).json({
        status: error.status,
        message: error.message,
      });
    else {
      console.error("error 💥", error);
      res.status(500).json({
        status: "error",
        message: error.message || "something went very wrong !",
      });
    }
  }
}

export default new ErrorUtils("");
