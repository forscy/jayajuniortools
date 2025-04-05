import * as paymentController from "../controllers/payment.controller";
import { Router } from "express";

import {
  authenticateJWT,
  verifyOwnerOrShopkeeperRole,
} from "../middlewares/auth.middleware";

const router = Router();

router.post("/", authenticateJWT, paymentController.createPayment);

router.post("/pay", authenticateJWT, paymentController.payPayment);

router.get("/:id", authenticateJWT, paymentController.getPaymentById);

router.get(
  "/",
  authenticateJWT,
  verifyOwnerOrShopkeeperRole,
  paymentController.getAllPayments
);

router.put(
  "/:id",
  authenticateJWT,
  verifyOwnerOrShopkeeperRole,
  paymentController.updatePaymentStatus
);


export default router;
