import { Router } from "express";
import { navigationRoutesController } from "../../controllers/Navigation";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    navigationRoutesController.getAllNavRoutes
  )
  .post(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    navigationRoutesController.createNavRoute
  );

router
  .route("/:routeId")
  .put(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    navigationRoutesController.updateNavRoute
  )
  .delete(
    checkAuth,
    restrictByRoles(["ADMIN"]),
    navigationRoutesController.deleteNavRoute
  );

export default router;
