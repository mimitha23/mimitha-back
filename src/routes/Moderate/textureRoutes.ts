import { Router } from "express";
import { textureController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(textureController.getAllTexture)
  .post(textureController.createTexture);

router
  .route("/:textureId")
  .put(textureController.updateTexture)
  .delete(textureController.deleteTexture);

export default router;
