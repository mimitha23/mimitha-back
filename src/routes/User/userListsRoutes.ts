import { Router } from "express";
import { userListsController } from "../../controllers/User";
import { checkAuth, restrictByRoles } from "../../middlewares";

const router = Router();

router
  .route("/")
  .get(checkAuth, restrictByRoles(["USER"]), userListsController.getAllList)
  .post(checkAuth, restrictByRoles(["USER"]), userListsController.createList);

router
  .route("/:listId")
  .get(checkAuth, restrictByRoles(["USER"]), userListsController.getAllFromList)
  .delete(checkAuth, restrictByRoles(["USER"]), userListsController.deleteList);

router
  .route("/:listId/:productId")
  .post(checkAuth, restrictByRoles(["USER"]), userListsController.addToList)
  .delete(
    checkAuth,
    restrictByRoles(["USER"]),
    userListsController.removeFromList
  );

export default router;
