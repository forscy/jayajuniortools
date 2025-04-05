import * as paymentController from "../controllers/payment.controller";
import { Router } from "express";

import { authenticateJWT } from "../middlewares/auth.middleware";

const router = Router();

router.post("/", paymentController.createPayment);

router.post("/pay", paymentController.payPayment);

router.get("/:id", paymentController.getPaymentById);


export default router;
