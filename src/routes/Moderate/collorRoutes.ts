import { Router } from "express";
import { checkAuth, restrictByRoles } from "../../middlewares";
import { createColor } from "../../controllers/Moderate/colorController";

const router = Router();

export default router;
