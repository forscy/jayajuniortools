// src/middlewares/error.middleware.ts
import { Request, Response, NextFunction } from "express";
import { sendResponse } from "../utils/responseWrapper";

const errorMiddleware = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  // Menggunakan sendResponse untuk error global
  sendResponse({
    res,
    statusCode: statusCode,
    status: "error",
    message: message,
  });
};

export default errorMiddleware;