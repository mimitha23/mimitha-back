import { Router } from "express";
import { variantController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(checkAuth, restrictByRoles(["ADMIN"]), variantController.getAllVariant)
  .post(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    variantController.uploadMedia("media"),
    variantController.createVariant
  );

router
  .route("/:variantId")
  .put(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    variantController.uploadMedia("media"),
    variantController.updateVariant
  )
  .delete(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    variantController.deleteVariant
  );

router
  .route("/types")
  .get(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    variantController.getExistingVariantTypes
  );

export default router;
