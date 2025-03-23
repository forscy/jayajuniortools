import { Router } from "express";
import * as productController from "../controllers/product.controller";
import {
  authenticateJWT,
  verifyOwnerRole,
  verifyInventoryManagerRole,
  verifyOwnerOrInventoryManagerRole,
} from "../middlewares/auth.middleware";
// Import validation middleware if available
// import { validateProductInput } from "../middlewares/validation.middleware";

const router = Router();

// ===== Public Routes =====
/**
 * GET routes - accessible to all users
 */
// Get all products with pagination
router.get("/", productController.getProducts);
// Search products with filters
router.get("/search", productController.searchProducts);
// Get product by ID
router.get("/:id", productController.getProductById);

// ===== Protected Routes =====
/**
 * POST, PUT, DELETE routes - require authentication and proper role
 */
// Create a new product
router.post(
  "/",
  authenticateJWT,
  verifyOwnerOrInventoryManagerRole,
  // validateProductInput, // Uncomment if you have validation middleware
  productController.createProduct
);

// Update an existing product
router.put(
  "/:id",
  authenticateJWT,
  verifyOwnerOrInventoryManagerRole,
  // validateProductInput, // Uncomment if you have validation middleware
  productController.updateProduct
);

// Delete a product - only owner can delete
router.delete(
  "/:id",
  authenticateJWT,
  verifyOwnerRole,
  productController.deleteProduct
);

export default router;
