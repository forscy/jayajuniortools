import { Request, Response } from "express";
import * as categoryService from "../services/category.service";
import { sendResponse } from "../utils/responseWrapper";

// Create a new category
export const createCategory = async (req: Request, res: Response) => {
  try {
    const category = await categoryService.createCategory(req.body);
    return sendResponse({
      res,
      statusCode: 201,
      status: "success",
      message: "Category created successfully",
      data: category,
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

// Get all categories
export const getCategories = async (req: Request, res: Response) => {
  try {
    const categories = await categoryService.getCategories();
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "Categories retrieved successfully",
      data: categories,
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
