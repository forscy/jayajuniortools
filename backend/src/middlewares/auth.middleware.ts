// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../config/client";
import { Role } from "@prisma/client";
import { sendResponse } from "../utils/responseWrapper";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token

  if (!token) {
    sendResponse(res, 401, "error", "User not authenticated");
    return; // Jika token tidak ada, kirim respon error
  }

  jwt.verify(token, process.env.JWT_SECRET!, (err: any, user: any) => {
    if (err) {
      sendResponse(res, 403, "error", "Invalid token");
      return; // Jika token tidak valid, kirim res
    }

    (req as any).user = user; // Menyimpan user info (userId dan email) di request untuk akses di controller
    next();
  });
};

// Middleware untuk memastikan pengguna adalah Owner
// Middleware untuk memastikan pengguna adalah Owner
export const verifyOwnerRole = async (req: Request, res: Response, next: NextFunction) => {
  const userId = (req as any).user?.userId; // Mendapatkan userId dari JWT

  if (!userId) {
    sendResponse(res, 401, "error", "User not authenticated");
    return; 
  }

  // Cek apakah pengguna memiliki role 'OWNER'
  const user = await prisma.user.findUnique({
    where: { id: userId },
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
  const userId = (req as any).user?.userId; // Mendapatkan userId dari JWT

  if (!userId) {
    sendResponse(res, 401, "error", "User not authenticated");
    return;
  }

  // Cek apakah pengguna memiliki role 'SHOPKEEPER'
  const userRole = await prisma.user.findFirst({
    where: {
      id: userId,
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
  const userId = (req as any).user?.userId; // Mendapatkan userId dari JWT

  if (!userId) {
    sendResponse(res, 401, "error", "User not authenticated");
    return;
  }

  // Cek apakah pengguna memiliki role 'INVENTORY_MANAGER'
  const userRole = await prisma.user.findFirst({
    where: {
      id: userId,
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
  const userId = (req as any).user?.userId; // Mendapatkan userId dari JWT

  if (!userId) {
    sendResponse(res, 401, "error", "User not authenticated");
    return;
  }

  // Cek apakah pengguna memiliki role 'BUYER'
  const userRole = await prisma.user.findFirst({
    where: {
      id: userId,
      role: Role.BUYER,
    },
  });

  if (!userRole) {
    sendResponse(res, 403, "error", "User is not a Buyer");
    return;
  }

  next(); // Jika pengguna adalah Buyer, lanjutkan ke proses berikutnya
};
