import { Router } from "express";
import { staffAuthController } from "../../controllers/Auth/";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router.route("/login").post(staffAuthController.login);
router
  .route("/logout")
  .post(
    checkAuth,
    restrictByRoles(["ADMIN", "MODERATOR"]),
    staffAuthController.logoutStaff
  );
router.route("/create-admin").post(staffAuthController.createAdmin);
router.route("/refresh").post(staffAuthController.refreshToken);

export default router;
