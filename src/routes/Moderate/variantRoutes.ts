import { Router } from "express";
import { variantController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(variantController.getAllVariant)
  .post(variantController.createVariant);

router
  .route("/:id")
  .put(variantController.updateVariant)
  .delete(variantController.deleteVariant);

export default router;
