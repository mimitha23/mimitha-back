import { Async, AppError, JWT } from "../lib";
import { Model as MongooseModelT, Document } from "mongoose";
import { IStaff } from "../models/interface/staff.types";
import { IUser } from "../models/interface/user/user.types";

export const refresh = <T extends Document>(Model: MongooseModelT<T>) =>
  Async(async function (req, res, next) {
    const { authorization } = req.cookies;

    if (!authorization)
      return next(new AppError(401, "you are not authorized"));

    const verifiedToken = await JWT.verifyToken(authorization, true);

    if (!verifiedToken) return next(new AppError(404, "user does not exists"));

    const user: IStaff | IUser | null = await Model.findById(verifiedToken._id);

    if (!user) return next(new AppError(404, "user does not exists"));

    const userData = {
      _id: user._id,
      fullname: user?.fullname,
      email: user.email,
      role: user.role,
    };

    const { accessToken } = JWT.asignToken({
      res,
      payload: userData,
    });

    res.status(201).json({ accessToken });
  });

export const logout = () =>
  Async(async function (req, res, next) {
    res.clearCookie("authorization");
    res.end();
  });
