import { Router } from "express";
import { textureController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(checkAuth, restrictByRoles(["ADMIN"]), textureController.getAllTexture)
  .post(checkAuth, restrictByRoles(["ADMIN"]), textureController.createTexture);

router
  .route("/:textureId")
  .put(checkAuth, restrictByRoles(["ADMIN"]), textureController.updateTexture)
  .delete(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    textureController.deleteTexture
  );

export default router;
