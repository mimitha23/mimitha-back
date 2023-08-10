import { Router } from "express";
import { productsController } from "../../controllers/Products";

const router = Router();

router.route("/developed").get(productsController.getAllDevelopedProducts);

router.route("/search").get(productsController.searchProducts);

router.route("/filter").get(productsController.getProductsFilter);

router.route("/:productId").get(productsController.getActiveProduct);

router
  .route("/:registeredProductId/edit")
  .get(productsController.getProductToEdit);

router.route("/:productId/related").get(productsController.getRelatedProducts);

export default router;
