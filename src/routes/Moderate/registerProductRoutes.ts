import { Router } from "express";
import { registerProductController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/form-sugestions")
  .get(registerProductController.getRegisterProductFormSugestions);

router
  .route("/:id")
  .put(registerProductController.updateRegisteredProduct)
  .delete(registerProductController.deleteRegisteredProduct);

router
  .route("/")
  .post(registerProductController.registerProduct)
  .get(registerProductController.getAllRegisteredProducts);

export default router;
