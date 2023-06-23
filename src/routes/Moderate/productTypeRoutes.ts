import { Router } from "express";
import { checkAuth, restrictByRoles } from "../../middlewares";
import { createProductType } from "../../controllers/Moderate/productTypeController";

const router = Router();

export default router;
