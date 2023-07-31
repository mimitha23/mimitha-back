import { Router } from "express";
import { userFavoritesController } from "../../controllers/User";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(
    checkAuth,
    restrictByRoles(["USER"]),
    userFavoritesController.getAllFavorites
  );

router
  .route("/:productId")
  .post(
    checkAuth,
    restrictByRoles(["USER"]),
    userFavoritesController.addToFavorites
  )
  .delete(
    checkAuth,
    restrictByRoles(["USER"]),
    userFavoritesController.removeFromFavorites
  );

export default router;
