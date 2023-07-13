import { Router } from "express";
import { developeProductController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/suggestions")
  .get(developeProductController.getDevelopeProductFormSugestions);

router
  .route("/:registeredProductId/products")
  .get(developeProductController.getAllDevelopedProducts)
  .post(
    developeProductController.uploadMedia("media"),
    developeProductController.attachDevelopedProduct
  );

router
  .route("/:registeredProductId/products/:productId")
  .get(developeProductController.getDevelopedProduct)
  .put(
    developeProductController.uploadMedia("media"),
    developeProductController.updateDevelopedProduct
  )
  .delete(developeProductController.deleteDevelopedProduct);

export default router;
