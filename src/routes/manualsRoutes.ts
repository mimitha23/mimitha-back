import { Router } from "express";
import { manualsController } from "../controllers";

const router = Router();

router.route("/create-admin").post(manualsController.createAdmin);

router
  .route("/create-moderate-defaults")
  .post(manualsController.createModerateDefaults);

router.route("/create-nav-defaults").post(manualsController.createNavDefaults);

export default router;
