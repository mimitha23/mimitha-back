import { Router } from "express";
import { variantController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(variantController.getAllVariant)
  .post(
    variantController.uploadMedia("media"),
    variantController.createVariant
  );

router
  .route("/:variantId")
  .put(variantController.uploadMedia("media"), variantController.updateVariant)
  .delete(variantController.deleteVariant);

router.route("/types").get(variantController.getExistingVariantTypes);

export default router;
