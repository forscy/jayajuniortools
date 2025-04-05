import * as orderController from "../controllers/order.controller";
import { Router } from "express";

import {
  authenticateJWT,
  verifyBuyerRole,
  verifyOwnerOrShopkeeperRole,
} from "../middlewares/auth.middleware";

const router = Router();

router.get(
  "/",
  authenticateJWT,
  verifyOwnerOrShopkeeperRole,
  orderController.getAllOrders
);

router.get(
  "/:id",
  authenticateJWT,
  verifyOwnerOrShopkeeperRole,
  orderController.getOrderById
);

router.post(
  "/",
  authenticateJWT,
  verifyOwnerOrShopkeeperRole,
  orderController.createOrder
);

router.post(
  "/buyer-order",
  authenticateJWT,
  verifyBuyerRole,
  orderController.buyerCreateOrder
);

router.put(
  "/cancel/:id",
  authenticateJWT,
  verifyOwnerOrShopkeeperRole,
  orderController.cancelOrderById
);

export default router;
