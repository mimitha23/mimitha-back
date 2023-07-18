import { Router } from "express";
import { moderateDefaultsController } from "../../controllers/Moderate";

const router = Router();

router.route("/").post(moderateDefaultsController.createDBDefaults);

export default router;
