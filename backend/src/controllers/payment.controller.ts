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
  console.info("Woi " + paymentId, amountPaid);
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

// Get all payments
export const getAllPayments = async (req: Request, res: Response) => {
  const { page, limit } = req.query;

  try {
    const payments = await paymentService.getAllPayments(
      Number(page) || 1,
      Number(limit) || 10
    );
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Payments retrieved successfully",
      data: payments,
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

// updatePaymentStatus
export const updatePaymentStatus = async (req: Request, res: Response) => {
  const { paymentId, status } = req.body;

  try {
    const payment = await paymentService.updatePaymentStatus(paymentId, status);
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Payment status updated successfully",
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
