import { Router } from "express";
import { productsController } from "../controllers";

const router = Router();

router.route("/developed").get(productsController.getAllDevelopedProducts);

router
  .route("/:registeredProductId/developed")
  .get(productsController.getAllDevelopedProductsByRegisteredProduct);

export default router;
