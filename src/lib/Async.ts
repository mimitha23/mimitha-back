import { Request, Response, NextFunction } from "express";

const Async =
  (
    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>
  ) =>
  (req: Request, res: Response, next: NextFunction) =>
    handler(req, res, next).catch(next);

export default Async;
