import { Async, JWT, AppError, Email } from "../../lib";
import UserUtils from "../../utils/UserUtils/UserUtils";
import { ReqUserT } from "../../types";
import { User } from "../../models";
import { refresh, logout } from "../handlerFactory";

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

  const user = await User.findOne({ email, authByGoogle: false }).select(
    "+password"
  );

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

  if (!user) {
    user = await new User({
      email,
      fullname: username,
      username,
      authByGoogle: true,
    }).save({ validateBeforeSave: false });

    await new Email({ adressat: user.email }).sendWelcome({
      userName: user.fullname,
    });
  }

  const userData = UserUtils.generateUserToClientData(user);

  const { accessToken } = JWT.asignToken({ payload: userData, res });

  res.status(201).json({ accessToken, user: userData });
});

export const logoutUser = logout();

// 1.0
export const forgotPassword = Async(async function (req, res, next) {
  const { email } = req.body;

  if (!email) return next(new AppError(403, "please enter your email"));

  const user = await User.findOne({ email, authByGoogle: false });

  if (!user)
    return next(new AppError(403, "user with this email does not exists"));

  const passwordResetToken = await user.createPasswordResetToken();

  await new Email({ adressat: user.email }).sendPasswordReset({
    userName: user.fullname,
    resetToken: passwordResetToken,
  });

  res.status(201).json({ emailIsSent: true, passwordResetToken });
});

// 1.1 route after forgotPassword
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

// 2.0 for users authenticated by the email and password
export const changePassword = Async(async function (req, res, next) {
  const currUser: ReqUserT = req.user;
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

// 3.0 for users authenticated by the google
export const demandSetPassword = Async(async function (req, res, next) {
  const currUser: ReqUserT = req.user;
  const { email } = req.body;
  const { userId } = req.params;

  if (!email || !userId)
    return next(new AppError(403, "please enter valid credentials."));
  else if (currUser._id !== userId || currUser.email !== email)
    return next(
      new AppError(403, "you are not authorised for this operation.")
    );

  const user = await User.findOne({
    email,
    _id: userId,
    authByGoogle: true,
  });

  if (!user)
    return next(
      new AppError(
        403,
        "invalid credentials or you are not registered with google."
      )
    );

  const passwordResetToken = await user.createPasswordResetToken();

  await new Email({ adressat: user.email }).sendPasswordReset({
    userName: user.fullname,
    resetToken: passwordResetToken,
  });

  res.status(201).json({ emailIsSent: true, passwordResetToken });
});

// 3.1 route after demandSetPassword
export const setPassword = Async(async function (req, res, next) {
  const currUser: ReqUserT = req.user;
  const { userId, token } = req.params;
  const { password } = req.body;

  if (!userId || !token)
    return next(new AppError(403, "please enter valid credentials."));
  else if (currUser._id !== userId)
    return next(
      new AppError(403, "you are not authorised for this operation.")
    );

  const { hashedToken } = UserUtils.generatePasswordResetToken(
    token.toString() || ""
  );

  const user = await User.findOne({
    _id: userId,
    authByGoogle: true,
    passwordResetToken: hashedToken,
    passwordResetAt: { $gte: Date.now() },
  });

  if (!user) return next(new AppError(403, "please enter valid credentials."));

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetAt = undefined;
  user.authByGoogle = false;
  await user.save();

  const { accessToken } = JWT.asignToken({ payload: user, res });

  res.status(201).json({ passwordIsSet: true, accessToken });
});

export const refreshToken = refresh(User);
