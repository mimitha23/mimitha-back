import { Router } from "express";
import { productsController } from "../controllers";

const router = Router();

router.route("/developed").get(productsController.getAllDevelopedProducts);

router.route("/search").get(productsController.searchProducts);

router.route("/:productId").get(productsController.getActiveProduct);

export default router;
