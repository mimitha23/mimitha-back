import { Router } from "express";
import { registerProductController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/form-sugestions")
  .get(registerProductController.getRegisterProductFormSugestions);

export default router;
