import { Router } from "express";
import { productStyleController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    productStyleController.getAllProductStyle
  )
  .post(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    productStyleController.createProductStyle
  );

router
  .route("/:styleId")
  .put(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    productStyleController.updateProductStyle
  )
  .delete(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    productStyleController.deleteProductStyle
  );

export default router;
