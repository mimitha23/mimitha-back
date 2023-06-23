import { Router } from "express";
import { checkAuth, restrictByRoles } from "../../middlewares";
import { createProductStyle } from "../../controllers/Moderate/productStyleController";

const router = Router();

export default router;
