import * as express from "express";

interface ReqUserT {
  _id: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      user: Record<ReqUserT>;
      file: Express.Multer.File;
      files: Express.Multer.File[];
      editedFileName: string | string[];
      originalFileName: string | string[];
      files: { [key: string]: Express.Multer.File[] } | Express.Multer.File[];
    }
  }
}
