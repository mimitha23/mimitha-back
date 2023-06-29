import { Router } from "express";
import { colorController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(colorController.getAllColor)
  .post(colorController.createColor);

router
  .route("/:id")
  .put(colorController.updateColor)
  .delete(colorController.deleteColor);

export default router;
