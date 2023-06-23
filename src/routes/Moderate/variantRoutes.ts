import { Router } from "express";
import { checkAuth, restrictByRoles } from "../../middlewares";
import { createVariant } from "../../controllers/Moderate/variantController";

const router = Router();

export default router;
