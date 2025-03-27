import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { sendResponse } from "../utils/responseWrapper";

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createProduct(req.body);
    return sendResponse(res, 201, "success", "Product created successfully", product);
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};

// Get all products with pagination
export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const { products, pagination } = await productService.getProducts(page, limit);
    return sendResponse(res, 200, "success", "Products retrieved successfully", products, pagination);
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};

// Get a product by ID
export const getProductById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const product = await productService.getProductById(id);
    return sendResponse(res, 200, "success", "Product retrieved successfully", product);
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};