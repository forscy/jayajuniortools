import { Request, Response } from "express";
import * as categoryService from "../services/category.service";
import { sendResponse } from "../utils/responseWrapper";


// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return sendResponse(res, 201, "success", "Category created successfully", category);
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategories();
    return sendResponse(res, 200, "success", "Categories retrieved successfully", categories);
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};
