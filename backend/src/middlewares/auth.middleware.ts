// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/client.config";
import { Role } from "@prisma/client";
import { sendResponse } from "../utils/responseWrapper";
import { extractBearerToken } from "../utils/auth";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractBearerToken(req); // Mendapatkan token dari request headers
  if (!token) {
    sendResponse(res, 401, "error", "User not authenticated");
    return; // Jika token tidak ada, kirim respon error
  }
  try {
    jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
      if (err) {
        sendResponse(res, 403, "error", err.message || "Invalid token");
        return; // Jika token tidak valid, kirim res
      }
      (req as any).user = user;
      next();
    });
  } catch (error: any) {
    sendResponse(res, 500, "error", error.message || "Error is not defined");
    return;
  }
};

// Middleware untuk memastikan pengguna adalah Owner
// Middleware untuk memastikan pengguna adalah Owner
export const verifyOwnerRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = (req as any).user?.email; // Mendapatkan id dari JWT

  if (!email) {
    sendResponse(res, 401, "error", "User not authenticated");
    return;
  }

  // Cek apakah pengguna memiliki role 'OWNER'
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: { role: true }, // Hanya mengambil role untuk memverifikasi
  });

  if (!user || user.role !== Role.OWNER) {
    sendResponse(res, 403, "error", "User is not an Owner");
    return;
  }

  next(); // Jika pengguna adalah Owner, lanjutkan ke proses berikutnya
};
// Middleware untuk memastikan pengguna adalah Shopkeeper
export const verifyShopkeeperRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = (req as any).user?.email; // Mendapatkan email dari JWT

  if (!email) {
    sendResponse(res, 401, "error", "User not authenticated");
    return;
  }

  // Cek apakah pengguna memiliki role 'SHOPKEEPER'
  const userRole = await prisma.user.findFirst({
    where: {
      email: email,
      role: Role.SHOPKEEPER,
    },
  });

  if (!userRole) {
    sendResponse(res, 403, "error", "User is not a Shopkeeper");
    return;
  }

  next(); // Jika pengguna adalah Shopkeeper, lanjutkan ke proses berikutnya
};

// Middleware untuk memastikan pengguna adalah Inventory Manager
export const verifyInventoryManagerRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = (req as any).user?.email; // Mendapatkan email dari JWT

  if (!email) {
    sendResponse(res, 401, "error", "User not authenticated");
    return;
  }

  // Cek apakah pengguna memiliki role 'INVENTORY_MANAGER'
  const userRole = await prisma.user.findFirst({
    where: {
      email: email,
      role: Role.INVENTORY_MANAGER,
    },
  });

  if (!userRole) {
    sendResponse(res, 403, "error", "User is not an Inventory Manager");
    return;
  }

  next(); // Jika pengguna adalah Inventory Manager, lanjutkan ke proses berikutnya
};

// Middleware untuk memastikan pengguna adalah Buyer
export const verifyBuyerRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = (req as any).user?.email; // Mendapatkan email dari JWT

  if (!email) {
    sendResponse(res, 401, "error", "User not authenticated");
    return;
  }

  // Cek apakah pengguna memiliki role 'BUYER'
  const userRole = await prisma.user.findFirst({
    where: {
      email: email,
      role: Role.BUYER,
    },
  });

  if (!userRole) {
    sendResponse(res, 403, "error", "User is not a Buyer");
    return;
  }

  next(); // Jika pengguna adalah Buyer, lanjutkan ke proses berikutnya
};

// verify owner or inventory manager can access
export const verifyOwnerOrInventoryManagerRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = (req as any).user?.email; // Mendapatkan email dari JWT

  if (!email) {
    sendResponse(res, 401, "error", "User not authenticated");
    return;
  }

  // Cek apakah pengguna memiliki role 'OWNER' atau 'INVENTORY_MANAGER'
  const userRole = await prisma.user.findFirst({
    where: {
      email: email,
      OR: [{ role: Role.OWNER }, { role: Role.INVENTORY_MANAGER }],
    },
  });

  if (!userRole) {
    sendResponse(
      res,
      403,
      "error",
      "User is not an Owner or Inventory Manager"
    );
    return;
  }

  next(); // Jika pengguna adalah Owner atau Inventory Manager, lanjutkan ke proses berikutnya
};

// Verify owner or shopkeeper can access
export const verifyOwnerOrShopkeeperRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = (req as any).user?.email; // Mendapatkan email dari JWT

  if (!email) {
    sendResponse(res, 401, "error", "User not authenticated");
    return;
  }

  // Cek apakah pengguna memiliki role 'OWNER' atau 'SHOPKEEPER'
  const userRole = await prisma.user.findFirst({
    where: {
      email: email,
      OR: [{ role: Role.OWNER }, { role: Role.SHOPKEEPER }],
    },
  });

  if (!userRole) {
    sendResponse(res, 403, "error", "User is not an Owner or Shopkeeper");
    return;
  }

  next(); // Jika pengguna adalah Owner atau Shopkeeper, lanjutkan ke proses berikutnya
};
