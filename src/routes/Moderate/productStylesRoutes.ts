import { Router } from "express";
import { productStyleController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(productStyleController.getAllProductStyle)
  .post(productStyleController.createProductStyle);

router
  .route("/:styleId")
  .put(productStyleController.updateProductStyle)
  .delete(productStyleController.deleteProductStyle);

export default router;
