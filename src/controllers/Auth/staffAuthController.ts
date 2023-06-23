import { Async, JWT, AppError, Email } from "../../lib";
import { Staff } from "../../models";

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

export const logout = Async(async function (req, res, next) {
  res.clearCookie("authorization");
  res.end();
});
