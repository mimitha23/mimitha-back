import { Router } from "express";
import { developeProductController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/suggestions")
  .get(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    developeProductController.getDevelopeProductFormSugestions
  );

router
  .route("/:registeredProductId/products")
  .get(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    developeProductController.getAllDevelopedProductsByRegisteredProduct
  )
  .post(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    developeProductController.uploadMedia("media"),
    developeProductController.attachDevelopedProduct
  );

router
  .route("/:registeredProductId/products/copy")
  .get(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    developeProductController.copyDevelopedProductConfig
  );

router
  .route("/:registeredProductId/products/:productId")
  .get(developeProductController.getDevelopedProduct)
  .put(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    developeProductController.uploadMedia("media"),
    developeProductController.updateDevelopedProduct
  )
  .delete(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    developeProductController.deleteDevelopedProduct
  );

export default router;
