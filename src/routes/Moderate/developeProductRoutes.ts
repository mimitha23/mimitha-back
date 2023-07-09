import { Router } from "express";
import { developeProductController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(developeProductController.getAllDevelopedProducts)
  .post(developeProductController.attachDevelopedProduct);

router
  .route("/suggestions")
  .get(developeProductController.getDevelopeProductFormSugestions);

router
  .route("/:productId")
  .put(developeProductController.updateDevelopedProduct)
  .delete(developeProductController.deleteDevelopedProduct);

export default router;
