import { Router } from "express";
import { productTypeController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(productTypeController.getAllProductType)
  .post(productTypeController.createProductType);

router
  .route("/:id")
  .put(productTypeController.updateProductType)
  .delete(productTypeController.deleteProductType);

export default router;
