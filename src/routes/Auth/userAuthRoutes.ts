import { Router } from "express";
import { userAuthController } from "../../controllers/Auth";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router.route("/register").post(userAuthController.register);
router.route("/login").post(userAuthController.login);
router.route("/login/google").post(userAuthController.googleLogin);

router
  .route("/logout")
  .post(checkAuth, restrictByRoles(["USER"]), userAuthController.logoutUser);

router.route("/forgot-password").post(userAuthController.forgotPassword);

router.route("/forgot-password/:token").post(userAuthController.updatePassword);

router
  .route("/change-password")
  .post(
    checkAuth,
    restrictByRoles(["USER"]),
    userAuthController.changePassword
  );

router
  .route("/demand-password/:userId")
  .post(
    checkAuth,
    restrictByRoles(["USER"]),
    userAuthController.demandSetPassword
  );

router
  .route("/demand-password/:userId/:token")
  .post(checkAuth, restrictByRoles(["USER"]), userAuthController.setPassword);

router.route("/refresh").post(checkAuth, userAuthController.refreshToken);

export default router;
