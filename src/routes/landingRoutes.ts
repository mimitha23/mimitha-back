import { Router } from "express";
import { landingController } from "../controllers";

const router = Router();

router.route("/").get(landingController.getLanding);

export default router;
