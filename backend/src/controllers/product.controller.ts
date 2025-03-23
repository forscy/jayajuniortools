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
    if (!product) {
      return sendResponse(res, 404, "error", "Product not found");
    }
    return sendResponse(res, 200, "success", "Product retrieved successfully", product);
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};

// Update a product
export const updateProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const product = await productService.updateProduct(id, req.body);
    return sendResponse(res, 200, "success", "Product updated successfully", product);
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};

// Delete a product
export const deleteProduct = async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);

  try {
    const result = await productService.deleteProduct(id);
    return sendResponse(res, 200, "success", "Product deleted successfully", result);
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};

// Search products
export const searchProducts = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  
  const searchParams: productService.ProductSearchParams = {};
  
  if (req.query.name) searchParams.name = req.query.name as string;
  if (req.query.minPrice) searchParams.minPrice = parseFloat(req.query.minPrice as string);
  if (req.query.maxPrice) searchParams.maxPrice = parseFloat(req.query.maxPrice as string);
  if (req.query.categoryId) searchParams.categoryId = parseInt(req.query.categoryId as string);
  if (req.query.inStock) searchParams.inStock = (req.query.inStock as string) === 'true';

  try {
    const { products, pagination } = await productService.searchProducts(searchParams, page, limit);
    return sendResponse(res, 200, "success", "Products retrieved successfully", products, pagination);
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};