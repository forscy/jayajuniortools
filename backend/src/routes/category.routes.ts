import { Router } from "express";
import * as categoryController from "../controllers/category.controller";
import {
  authenticateJWT,
  verifyOwnerOrInventoryManagerRole,
} from "../middlewares/auth.middleware";

const router = Router();

// Create a new category
router.post(
  "/",
  authenticateJWT,
  verifyOwnerOrInventoryManagerRole,
  categoryController.createCategory
);

// Get all categories
router.get("/", categoryController.getCategories);

export default router;
