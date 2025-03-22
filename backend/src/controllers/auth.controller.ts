// src/controllers/auth.controller.ts
import { Request, Response } from "express";
import * as authService from "../services/auth.service";
import { sendResponse } from "../utils/responseWrapper";
import { Role } from "@prisma/client";

// Check if user is authenticated
export const isAuthenticated = async (req: Request, res: Response) => {
  return sendResponse(res, 200, "success", "User is authenticated", {
    isAuthenticated: true,
    user: (req as any).user,
  });
};

export const signUp = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  try {
    const result = await authService.signUpService(name, email, password);
    return sendResponse(res, 201, "success", result.message, {
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};

export const signIn = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    const result = await authService.signInService(email, password);
    return sendResponse(res, 200, "success", result.message, {
      token: result.token,
      user: result.user,
    });
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};

export const changePassword = async (req: Request, res: Response) => {
  const { oldPassword, newPassword } = req.body;
  const email = (req as any).user?.email; // Dapatkan email dari token (setelah proses autentikasi)

  if (!email) {
    return sendResponse(res, 400, "error", "User not authenticated");
  }

  try {
    const result = await authService.changePasswordService(
      email,
      oldPassword,
      newPassword
    );
    return sendResponse(res, 200, "success", result.message);
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};

export const createAccount = async (req: Request, res: Response) => {
  const { name, email, password, role } = req.body;

  // Validasi role
  if (role !== Role.SHOPKEEPER && role !== Role.INVENTORY_MANAGER) {
    return sendResponse(
      res,
      400,
      "error",
      "Role must be either Shopkeeper or Inventory Manager"
    );
  }

  try {
    const result = await authService.createAccountService({
      name,
      email,
      password,
      role,
    });
    return sendResponse(res, 201, "success", result.message, {
      email: result.email,
      role: result.role,
    });
  } catch (error: any) {
    return sendResponse(
      res,
      500,
      "error",
      error.message || "Failed to create user"
    );
  }
};

export const suspendAccount = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const result = await authService.suspendAccountService({ email });
    return sendResponse(res, 200, "success", result.message, {
      email: result.email,
    });
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};

export const deleteAccount = async (req: Request, res: Response) => {
  const { email } = req.body;

  try {
    const result = await authService.deleteAccountService({ email });
    return sendResponse(res, 200, "success", result.message, {
      email: result.email,
    });
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};

export const editAccount = async (req: Request, res: Response) => {
  const { name, email, role, status } = req.body;

  try {
    const result = await authService.editAccountService({
      email,
      name,
      role,
      status,
    });

    return sendResponse(res, 200, "success", result.message, {
      email: result.email,
    });
  } catch (error: any) {
    return sendResponse(res, 400, "error", error.message);
  }
};
