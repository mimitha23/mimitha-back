import { Router } from "express";
import { developeProductController } from "../../controllers/Products";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/suggestions")
  .get(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    developeProductController.getDevelopeProductFormSuggestions
  );

router
  .route("/:registeredProductId/products")
  .get(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    developeProductController.getAllDevelopedProductsByRegisteredProduct
  )
  .post(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    developeProductController.uploadImageMedia([
      { name: "new_assets[]", maxCount: 10 },
      { name: "new_front_thumbnail" },
      { name: "new_back_thumbnail" },
      { name: "new_mannequin" },
      { name: "new_model_video" },
      { name: "new_simulation_video_placing" },
      { name: "new_simulation_video_pick_up" },
    ]),
    developeProductController.attachDevelopedProduct
  );

router
  .route("/:registeredProductId/products/copy")
  .get(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    developeProductController.copyDevelopedProductConfig
  );

router
  .route("/:registeredProductId/products/:productId")
  .get(developeProductController.getDevelopedProduct)
  .put(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    developeProductController.uploadImageMedia([
      { name: "new_assets[]", maxCount: 10 },
      { name: "new_front_thumbnail" },
      { name: "new_back_thumbnail" },
      { name: "new_mannequin" },
      { name: "new_model_video" },
      { name: "new_simulation_video_placing" },
      { name: "new_simulation_video_pick_up" },
    ]),
    developeProductController.updateDevelopedProduct
  )
  .delete(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    developeProductController.deleteDevelopedProduct
  );

export default router;
// { [key: string]: string; maxCount: number }[]
