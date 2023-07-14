import { Staff } from "../../models";
import { Async, JWT, AppError, Email } from "../../lib";
import { refresh, logout } from "../handlerFactory";

export const login = Async(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError(403, "please enter your email and password"));

  const user = await Staff.findOne({ email }).select("+password");

  if (!user) return next(new AppError(403, "incorect email or password"));

  const validPassword = await user.checkPassword(password, user.password);

  if (!validPassword)
    return next(new AppError(403, "incorect email or password"));

  const userData = {
    _id: user._id,
    fullname: user.fullname,
    email: user.email,
    role: user.role,
  };

  const { accessToken } = JWT.asignToken({ payload: userData, res });

  res.status(201).json({ accessToken, user: userData });
});

export const createAdmin = Async(async function (req, res, next) {
  const body = req.body;

  if (!body.fullname || !body.email || !body.password)
    return next(
      new AppError(403, "please enter your fullname, email and password")
    );

  const registeredAdmin = await Staff.findOne({ role: "ADMIN" });

  if (registeredAdmin) return next(new AppError(400, "admin already exists"));

  await Staff.create({
    fullname: body.fullname,
    email: body.email,
    password: body.password,
    role: "ADMIN",
  });

  res.status(201).json("admin is created");
});

export const logoutStaff = logout();

export const refreshToken = refresh(Staff);
