import { Router } from "express";
import { navigationRoutesController } from "../../controllers/App";

const router = Router();

router.route("/").post(navigationRoutesController.createNavRoute);

export default router;
