import { Router } from "express";
import { navigationController } from "../../controllers/Navigation";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(navigationController.getNavigation)
  .put(checkAuth, restrictByRoles(["ADMIN"]), navigationController.saveNav);

export default router;
