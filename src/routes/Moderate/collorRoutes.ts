import { Router } from "express";
import { colorController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(checkAuth, restrictByRoles(["ADMIN"]), colorController.getAllColor)
  .post(checkAuth, restrictByRoles(["ADMIN"]), colorController.createColor);

router
  .route("/:colorId")
  .put(checkAuth, restrictByRoles(["ADMIN"]), colorController.updateColor)
  .delete(checkAuth, restrictByRoles(["ADMIN"]), colorController.deleteColor);

export default router;
