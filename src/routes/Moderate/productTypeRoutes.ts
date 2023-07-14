import { Router } from "express";
import { productTypeController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    productTypeController.getAllProductType
  )
  .post(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    productTypeController.createProductType
  );

router
  .route("/:typeId")
  .put(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    productTypeController.updateProductType
  )
  .delete(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    productTypeController.deleteProductType
  );

export default router;
