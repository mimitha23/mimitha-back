import { Router } from "express";
import {
  register,
  login,
  googleLogin,
  logout,
  forgotPassword,
  updatePassword,
  changePassword,
  refresh,
} from "../../controllers/Auth/authController";
import { checkAuth } from "../../middlewares/checkAuth";

const router = Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/login/google").post(googleLogin);
router.route("/logout").post(logout);
router.route("/forgot-password").post(forgotPassword);
router.route("/forgot-password/:token").post(updatePassword);
router.route("/change-password").post(checkAuth, changePassword);
router.route("/refresh").post(refresh);

export default router;
