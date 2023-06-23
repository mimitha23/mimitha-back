import { Router } from "express";
import { login, logout } from "../../controllers/Auth/staffAuthController";
import { checkAuth } from "../../middlewares";

const router = Router();

router.route("/login").post(login);
router.route("/logout").post(logout);

export default router;
