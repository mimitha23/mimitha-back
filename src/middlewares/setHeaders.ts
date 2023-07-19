import { Request, Response, NextFunction } from "express";

export default function setHeaders(
  req: Request,
  res: Response,
  next: NextFunction
) {
  res.header("Access-Control-Allow-credentials", "true");
  res.header("Access-Control-Allow-Origin", req.headers.origin);
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Origin, Authorization"
  );

  if (req.method === "OPTIONS") res.sendStatus(200);
  else next();
}
