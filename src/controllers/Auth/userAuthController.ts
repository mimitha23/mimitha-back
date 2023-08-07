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

  const { accessToken } = JWT.asignToken({
    payload: { ...userData, role: user.role },
    res,
  });

  res.status(201).json({ accessToken, user: userData });
});

///////////////////////
// LOGIN AND LOGOUT //
/////////////////////

export const login = Async(async function (req, res, next) {
  const { email, password } = req.body;

  if (!email || !password)
    return next(new AppError(401, "please enter your email and password"));

  const user = await User.findOne({ email, authByGoogle: false }).select(
    "+password"
  );

  if (!user) return next(new AppError(401, "incorrect email or password"));

  const validPassword = await user.checkPassword(password, user.password);

  if (!validPassword)
    return next(new AppError(401, "incorrect email or password"));

  const userData = UserUtils.generateUserToClientData(user);

  const { accessToken } = JWT.asignToken({
    payload: { ...userData, role: user.role },
    res,
  });

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

  const { accessToken } = JWT.asignToken({
    payload: { ...userData, role: user.role },
    res,
  });

  res.status(201).json({ accessToken, user: userData });
});

export const logoutUser = logout();

//////////////////////
// FORGOT PASSWORD //
////////////////////

// 1.0 send PIN to user by email
export const forgotPassword = Async(async function (req, res, next) {
  const { email } = req.body;

  if (!email) return next(new AppError(403, "please enter your email"));

  const user = await User.findOne({ email, authByGoogle: false });

  if (!user)
    return next(new AppError(403, "user with this email does not exists"));

  const pin = await user.createConfirmEmailPin();

  await new Email({ adressat: user.email }).sendConfirmEmailPin({
    pin,
    userName: user.fullname || user.username,
  });

  res.status(201).json({ emailIsSent: true });
});

// 1.2 confirm email with comparing PIN and assign passwordResetToken to HTTPOnly cookie
export const confirmEmail = Async(async function (req, res, next) {
  const { pin } = req.body;

  if (!pin)
    return next(
      new AppError(403, "please provide us the PIN sent to your Email")
    );

  const { hashedToken } = UserUtils.generatePasswordResetToken(
    pin.toString() || ""
  );

  const user = await User.findOne({ confirmEmailPin: hashedToken });

  if (!user) return next(new AppError(403, "token is invalid or is expired."));

  const isExpired = Date.now() > new Date(user.emailPinResetAt!).getTime();

  if (isExpired) {
    user.confirmEmailPin = undefined;
    user.emailPinResetAt = undefined;
    return next(new AppError(403, "token is invalid or is expired."));
  }

  user.confirmEmailPin = undefined;
  user.emailPinResetAt = undefined;

  await user.save();

  const passwordResetToken = await user.createPasswordResetToken();

  const cookieOptions = {
    httpOnly: true,
    secure: false,
    sameSite: false,
  };

  // if (NODE_MODE === "PROD") cookieOptions.secure = true;

  res.cookie("password_reset_token", passwordResetToken, cookieOptions);

  res.status(201).json({ emailIsConfirmed: true });
});

// 1.3 let user update password after validating passwordResetToken
export const updatePassword = Async(async function (req, res, next) {
  const { password_reset_token }: any = req.cookies;
  const { password } = req.body;

  const err = () =>
    next(
      new AppError(
        403,
        "Invalid request. Please retry the password update from sending email."
      )
    );

  if (!password_reset_token) return err();

  const { hashedToken } = UserUtils.generatePasswordResetToken(
    password_reset_token.toString() || ""
  );

  const user = await User.findOne({ passwordResetToken: hashedToken });

  if (!user) {
    res.clearCookie("password_reset_token");
    return err();
  }

  const isExpired = Date.now() > new Date(user.passwordResetAt!).getTime();

  if (isExpired) {
    res.clearCookie("password_reset_token");
    user.passwordResetToken = undefined;
    user.passwordResetAt = undefined;
    return err();
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetAt = undefined;

  await user.save();

  res.clearCookie("password_reset_token");

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

  // await new Email({ adressat: user.email }).sendPasswordReset({
  //   userName: user.fullname,
  //   resetToken: passwordResetToken,
  // });

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
