import * as express from "express";

interface ReqUserT {
  _id: string;
  email: string;
  role: string;
  username?: string;
  fullname?: string;
}

declare global {
  namespace Express {
    interface Request {
      user: Record<ReqUserT>;
    }
  }
}
