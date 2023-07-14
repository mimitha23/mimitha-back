import { ReqUserT } from "../types";
import { User, Staff } from "../models";
import { Async, AppError, JWT } from "../lib";
import { STAFF_ROLES, IStaff } from "../models/interface/staff.types";
import { USER_ROLES, IUser } from "../models/interface/user.types";

const checkAuth = Async(async function (req, _, next) {
  const authorizationHeader = req.headers.authorization;

  if (
    !authorizationHeader ||
    (authorizationHeader && !authorizationHeader.startsWith("Bearer "))
  )
    return next(new AppError(401, "you are not authorised"));

  const token = authorizationHeader.split("Bearer ")[1];

  if (!token) return next(new AppError(401, "you are not authorised"));

  const verifiedToken = await JWT.verifyToken(token, false);

  if (!verifiedToken) return next(new AppError(401, "you are not authorised"));

  const isUser = USER_ROLES.includes(verifiedToken.role);
  const isStaff = STAFF_ROLES.includes(verifiedToken.role);

  if (!isUser && !isStaff)
    return next(new AppError(401, "you are not authorised"));

  const user: IStaff | IUser | null = isUser
    ? await User.findById(verifiedToken._id)
    : isStaff
    ? await Staff.findById(verifiedToken._id)
    : null;

  if (!user) return next(new AppError(401, "you are not authorised"));

  const reqUser: ReqUserT = {
    _id: user._id.toString(),
    email: user.email,
    role: user.role,
  };

  req.user = reqUser;

  next();
});

export default checkAuth;
