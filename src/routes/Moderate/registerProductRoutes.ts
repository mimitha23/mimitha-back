import { Router } from "express";
import { registerProductController } from "../../controllers/Moderate";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/form-sugestions")
  .get(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    registerProductController.getRegisterProductFormSugestions
  );

router
  .route("/:productId")
  .put(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    registerProductController.uploadMedia("media"),
    registerProductController.updateRegisteredProduct
  )
  .delete(registerProductController.deleteRegisteredProduct);

router
  .route("/")
  .post(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    registerProductController.uploadMedia("media"),
    registerProductController.registerProduct
  )
  .get(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    registerProductController.getAllRegisteredProducts
  );

export default router;
