import { Async, AppError, JWT } from "../lib";
import User from "../models/User";
import { ReqUserT } from "../types";

const checkAuth = Async(async function (req, _, next) {
  const authorizationHeader = req.headers.authorization;

  if (
    !authorizationHeader ||
    (authorizationHeader && !authorizationHeader.startsWith("Bearer "))
  )
    return next(new AppError(403, "you are not authorised"));

  const token = authorizationHeader.split("Bearer ")[1];

  if (!token) return next(new AppError(403, "you are not authorised"));

  const verifiedToken = await JWT.verifyToken(token, false);

  if (!verifiedToken) return next(new AppError(403, "you are not authorised"));

  const user = await User.findById(verifiedToken._id);

  if (!user) return next(new AppError(403, "you are not authorised"));

  req.user = <ReqUserT>{
    _id: user._id.toString(),
    email: user.email,
    username: user.username,
  };

  next();
});

export default checkAuth;
