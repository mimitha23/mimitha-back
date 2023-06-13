import User from "../../models/User";
import { Async, JWT, AppError } from "../../lib";
import UserUtils from "../../utils/UserUtils/UserUtils";

export const register = Async(async function (req, res, next) {
  const { fullname, username, email, password } = req.body;

  const user = await new User({
    fullname,
    username,
    email,
    password,
  }).save();

  const userData = UserUtils.generateUserToClientData(user);

  const { accessToken } = JWT.asignToken({ payload: userData, res });

  res.status(201).json({ accessToken, user: userData });
});

export const login = Async(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError(403, "please enter your email and password"));

  const user = await User.findOne({ email }).select("+password");

  if (!user) return next(new AppError(403, "incorect email or password"));

  const validPassword = await user.checkPassword(password, user.password);

  if (!validPassword)
    return next(new AppError(403, "incorect email or password"));

  const userData = UserUtils.generateUserToClientData(user);

  const { accessToken } = JWT.asignToken({ payload: userData, res });

  res.status(201).json({ accessToken, user: userData });
});

export const googleLogin = Async(async function (req, res, next) {
  const { email, username } = req.body;

  if (!email || !username)
    return next(new AppError(403, "please provide us valid credentials"));

  let user = await User.findOne({ email });

  if (!user)
    user = await new User({
      email,
      fullname: username,
      authByGoogle: true,
    }).save({ validateBeforeSave: false });

  const userData = UserUtils.generateUserToClientData(user);

  const { accessToken } = JWT.asignToken({ payload: userData, res });

  res.status(201).json({ accessToken, user: userData });
});

export const logout = Async(async function (req, res, next) {
  res.clearCookie("authorization");
  res.end();
});

export const forgotPassword = Async(async function (req, res, next) {
  const { email } = req.body;

  if (!email) return next(new AppError(403, "please enter your email"));

  const user = await User.findOne({ email });

  if (!user)
    return next(new AppError(403, "user with this email does not exists"));

  const passwordResetToken = await user.createPasswordResetToken();

  // send email

  res.status(201).json({ emailIsSent: true, passwordResetToken });
});

export const updatePassword = Async(async function (req, res, next) {
  const { token } = req.params;
  const { password } = req.body;

  if (!token) return next(new AppError(403, "invalid request."));

  const { hashedToken } = UserUtils.generatePasswordResetToken(
    token.toString() || ""
  );

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetAt: { $gte: Date.now() },
  });

  if (!user) return next(new AppError(403, "token is invalid or expired."));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetAt = undefined;

  await user.save();

  res.status(201).json({ passwordIsUpdated: true });
});

export const changePassword = Async(async function (req, res, next) {
  const currUser = req.user;
  const { password, newPassword } = req.body;

  if (!password || !newPassword)
    return next(new AppError(403, "please enter valid credentials."));

  const user = await User.findById(currUser._id).select("+password");
  if (!user) return next(new AppError(403, "please enter valid credentials."));

  const validPassword = user.checkPassword(password, user.password);
  if (!validPassword)
    return next(new AppError(403, "please enter valid credentials."));

  user.password = newPassword;
  await user.save();

  const { accessToken } = JWT.asignToken({ payload: user, res });

  res.status(201).json({ passwordIsChanged: true, accessToken });
});

export const refresh = Async(async function (req, res, next) {});
