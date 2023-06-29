import { Request, Response, NextFunction } from "express";

type HandlerFunctionT = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<any>;

const Async =
  (handler: HandlerFunctionT) =>
  (req: Request, res: Response, next: NextFunction) =>
    handler(req, res, next).catch(next);

export default Async;
