import { Request, Response } from "express";
import * as userService from "../services/user.service";
import { sendResponse } from "../utils/responseWrapper";

// get all users
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await userService.getAllUsers();
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "All users",
      data: users,
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

// get user by email
export const getUserByEmail = async (req: Request, res: Response) => {
  const email = req.params.email;

  try {
    const user = await userService.getUserByEmail(email);
    return sendResponse({
      res,
      statusCode: 200,
      status: "success",
      message: "User found",
      data: user,
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
