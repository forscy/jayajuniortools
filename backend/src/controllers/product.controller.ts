import { Request, Response } from "express";
import * as productService from "../services/product.service";
import { sendResponse } from "../utils/responseWrapper";
import { ProductStatus } from "@prisma/client";

// Create a new product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await productService.createOrUpdateProduct(req.body);
    return sendResponse({
      res,
      statusCode: 201,
      status: "success",
      message: "Product created successfully",
      data: product,
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

// Update an existing product
export const updateProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const product = await productService.createOrUpdateProduct(req.body, id);
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Product updated successfully",
      data: product,
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

// Get all products with pagination
export const getProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const { products, pagination } = await productService.getProducts(
      page,
      limit
    );
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Products retrieved successfully",
      data: products,
      pagination,
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

// Get product where product status is AVAILABLE or COMMING_SOON
export const getProductsAvailableAndCommingSoon = async (
  req: Request,
  res: Response
) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const { products, pagination } = await productService.getProducts(
      page,
      limit,
      [ProductStatus.AVAILABLE, ProductStatus.COMMING_SOON]
    );
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Products retrieved successfully",
      data: products,
      pagination,
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

// Get a product by ID
export const getProductById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const product = await productService.getProductById(id);
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Product retrieved successfully",
      data: product,
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

// Hard delete product by id
export const hardDeleteProductById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const statusDelete = await productService.hardDeleteProductById(id);
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Product hard deleted successfully",
      data: statusDelete,
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

// Soft delete product by id
export const softDeleteProductById = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const statusDelete = await productService.softDeleteProductById(id);
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Product soft deleted successfully",
      data: statusDelete,
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
