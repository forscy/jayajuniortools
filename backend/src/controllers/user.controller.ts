import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { sendResponse } from "../utils/responseWrapper";

// get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return sendResponse(res, 200, "success", "All users", users);
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};

// get user by email
export const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.params.email;

  try {
    const user = await userService.getUserByEmail(email);
    return sendResponse(res, 200, "success", "User found", user);
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};