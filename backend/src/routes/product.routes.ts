import { Router } from "express";
import * as productController from "../controllers/product.controller";
import {
  authenticateJWT,
  verifyOwnerRole,
  verifyInventoryManagerRole,
  verifyOwnerOrInventoryManagerRole,
  verifyOwnerOrInventoryManagerOrShopkeeperRole,
} from "../middlewares/auth.middleware";
// Import validation middleware if available
// import { validateProductInput } from "../middlewares/validation.middleware";

const router = Router();

//
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

// Get product where product status is AVAILABLE or COMMING_SOON
router.get("/", productController.getProductsAvailableAndCommingSoon);

// Get all product
router.get(
  "/all",
  authenticateJWT,
  verifyOwnerOrInventoryManagerOrShopkeeperRole,
  productController.getProducts
);

router.get("/:id", productController.getProductById);

// hard delete by id
router.delete(
  "/hard/:id",
  authenticateJWT,
  verifyOwnerRole,
  productController.hardDeleteProductById
);

// sotf delete by id
router.delete(
  "/soft/:id",
  authenticateJWT,
  verifyOwnerOrInventoryManagerRole,
  productController.softDeleteProductById
);

export default router;
