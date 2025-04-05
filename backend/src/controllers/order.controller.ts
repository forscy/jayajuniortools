import { Request, Response } from "express";
import * as orderService from "../services/order.service";
import { sendResponse } from "../utils/responseWrapper";

// Buyer create order sendiri
export const buyerCreateOrder = async (req: Request, res: Response) => {
  const { items } = req.body;
  const user = (req as any).user;
  console.log(user);

  try {
    const order = await orderService.createOrder({
      userId: user.id,
      items,
      maker: user.name,
      emailMaker: user.email,
    });
    return sendResponse({
      res,
      statusCode: 201,
      status: "success",
      message: "Order created successfully",
      data: order,
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

// Fungsi untuk membuat order baru
export const createOrder = async (req: Request, res: Response) => {
  const { userId, items, maker, emailMaker } = req.body;

  try {
    const order = await orderService.createOrder({
      userId,
      items,
      maker,
      emailMaker,
    });
    return sendResponse({
      res,
      statusCode: 201,
      status: "success",
      message: "Order created successfully",
      data: order,
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

// Get order by ID
export const getOrderById = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const order = await orderService.getOrderById(Number(id));
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Order retrieved successfully",
      data: order,
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

// Get all orders
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const { page, limit } = req.body;
    const orders = await orderService.getOrders({
      limit,
      page,
    });
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Orders retrieved successfully",
      data: orders,
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

// Cancel order
export const cancelOrderById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const canceledOrder = await orderService.cancelOrderById(parseInt(id));
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Order berhasil di batalkan",
      data: canceledOrder,
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
