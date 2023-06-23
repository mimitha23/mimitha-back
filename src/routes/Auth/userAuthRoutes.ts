import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  logout,
  forgotPassword,
  updatePassword,
  changePassword,
  demandSetPassword,
  setPassword,
  refresh,
} from "../../controllers/Auth/userAuthController";
import { checkAuth } from "../../middlewares";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/login/google").post(googleLogin);
router.route("/logout").post(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/forgot-password/:token").post(updatePassword);
router.route("/change-password").post(checkAuth, changePassword);
router.route("/demand-password/:userId").post(checkAuth, demandSetPassword);
router.route("/demand-password/:userId/:token").post(checkAuth, setPassword);
router.route("/refresh").post(checkAuth, refresh);

export default router;
