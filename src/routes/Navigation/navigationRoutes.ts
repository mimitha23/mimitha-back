import { Router } from "express";
import { navigationController } from "../../controllers/App";

const router = Router();

router.route("/").get(navigationController.getNavigation);

export default router;
