class AppError extends Error {
  status;
  statusCode;
  isOperational;

  constructor(statusCode: number, message: string) {
    super(message);
    this.statusCode = statusCode;
    this.status = statusCode.toString().startsWith("4") ? "fail" : "error";
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
