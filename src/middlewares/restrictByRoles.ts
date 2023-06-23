import { Async, AppError } from "../lib";
import { ReqUserT } from "../types";

const restrictByRoles = (roles: string[]) =>
  Async(async function (req, _, next) {
    const currUser: ReqUserT = req.user;

    const currUserRole = currUser.role;

    if (roles.includes(currUserRole))
      return next(
        new AppError(403, "you are not authorised for this operation")
      );

    next();
  });

export default restrictByRoles;
