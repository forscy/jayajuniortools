import { Request, Response } from "express";
import * as paymentService from "../services/payment.service";
import { sendResponse } from "../utils/responseWrapper";

// Fungsi untuk membuat payment baru
export const createPayment = async (req: Request, res: Response) => {
  const { orderId, receiverId } = req.body;

  try {
    const payment = await paymentService.createPayment({
      orderId,
      receiverId,
    });
    return sendResponse({
      res,
      statusCode: 201,
      status: "success",
      message: "Payment created successfully",
      data: payment,
    });
  } catch (error: any) {
    return sendResponse({
      res,
      statusCode: 400,
      status: "error",
      message: error.message,
    });
  }
};

// Pay the payment
export const payPayment = async (req: Request, res: Response) => {
  const { paymentId, amountPaid } = req.body;

  try {
    const payment = await paymentService.payPayment(paymentId, amountPaid);
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Payment completed successfully",
      data: payment,
    });
  } catch (error: any) {
    return sendResponse({
      res,
      statusCode: 400,
      status: "error",
      message: error.message,
    });
  }
};

// Get payment by ID
export const getPaymentById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const payment = await paymentService.getPaymentById(Number(id));
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Payment retrieved successfully",
      data: payment,
    });
  } catch (error: any) {
    return sendResponse({
      res,
      statusCode: 404,
      status: "error",
      message: error.message,
    });
  }
};
