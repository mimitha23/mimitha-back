import * as express from "express";

interface ReqUserT {
  _id: string;
  email: string;
  username: string;
}

declare global {
  namespace Express {
    interface Request {
      user: Record<ReqUserT>;
    }
  }
}
