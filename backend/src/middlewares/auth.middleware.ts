// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import { prisma } from "../config/client.config";
import { Role } from "@prisma/client";
import { sendResponse } from "../utils/responseWrapper";
import { extractBearerToken, verifyToken } from "../utils/auth.util";

export const authenticateJWT = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = extractBearerToken(req); // Mendapatkan token dari request headers
  if (!token) {
    sendResponse({
      res,
      statusCode: 401,
      status: "error",
      message: "User not authenticated",
    });
    return; // Jika token tidak ada, kirim respon error
  }

  const { valid, message, payload } = verifyToken(token);
  if (!valid) {
    sendResponse({
      res,
      statusCode: 403,
      status: "error",
      message: message || "Invalid token",
    });

    return; // Jika token tidak valid, kirim respon error
  }

  // Menyimpan payload dari token ke dalam request untuk digunakan di route berikutnya
  (req as any).user = payload;
  next();
};

// Middleware untuk memastikan pengguna adalah Owner
export const verifyOwnerRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = (req as any).user?.email; // Mendapatkan id dari JWT

  if (!email) {
    sendResponse({
      res,
      statusCode: 401,
      status: "error",
      message: "User not authenticated",
    });
    data: return;
  }

  // Cek apakah pengguna memiliki role 'OWNER'
  const user = await prisma.user.findUnique({
    where: { email: email },
    select: { role: true }, // Hanya mengambil role untuk memverifikasi
  });

  if (!user || user.role !== Role.OWNER) {
    sendResponse({
      res,
      statusCode: 403,
      status: "error",
      message: "User is not an Owner",
    });
    return;
  }

  next(); // Jika pengguna adalah Owner lanjutkan ke proses berikutnya
};
// Middleware untuk memastikan pengguna adalah Shopkeeper
export const verifyShopkeeperRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = (req as any).user?.email; // Mendapatkan email dari JWT

  if (!email) {
    sendResponse({
      res,
      statusCode: 401,
      status: "error",
      message: "User not authenticated",
    });
    data: return;
  }

  // Cek apakah pengguna memiliki role 'SHOPKEEPER'
  const userRole = await prisma.user.findFirst({
    where: {
      email: email,
      role: Role.SHOPKEEPER,
    },
  });

  if (!userRole) {
    sendResponse({
      res,
      statusCode: 403,
      status: "error",
      message: "User is not a Shopkeeper",
    });
    data: return;
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
    sendResponse({
      res,
      statusCode: 401,
      status: "error",
      message: "User not authenticated",
    });
    data: return;
  }

  // Cek apakah pengguna memiliki role 'INVENTORY_MANAGER'
  const userRole = await prisma.user.findFirst({
    where: {
      email: email,
      role: Role.INVENTORY_MANAGER,
    },
  });

  if (!userRole) {
    sendResponse({
      res,
      statusCode: 403,
      status: "error",
      message: "User is not an Inventory Manager",
    });
    data: return;
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
    sendResponse({
      res,
      statusCode: 401,
      status: "error",
      message: "User not authenticated",
    });
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
    sendResponse({
      res,
      statusCode: 403,
      status: "error",
      message: "User is not a Buyer",
    });
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
    sendResponse({
      res,
      statusCode: 401,
      status: "error",
      message: "User not authenticated",
    });

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
    sendResponse({
      res,
      statusCode: 403,
      status: "error",
      message: "User is not an Owner or Inventory Manager",
    });
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
    sendResponse({
      res,
      statusCode: 401,
      status: "error",
      message: "User not authenticated",
    });
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
    sendResponse({
      res,
      statusCode: 403,
      status: "error",
      message: "User is not an Owner or Shopkeeper",
    });
    return;
  }

  next(); // Jika pengguna adalah Owner atau Shopkeeper, lanjutkan ke proses berikutnya
};

// verify owner or shopkeeper or inventory manager
export const verifyOwnerOrInventoryManagerOrShopkeeperRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const email = (req as any).user?.email; // Mendapatkan email dari JWT

  if (!email) {
    sendResponse({
      res,
      statusCode: 401,
      status: "error",
      message: "User not authenticated",
    });

    return;
  }

  // Cek apakah pengguna memiliki role 'OWNER' atau 'SHOPKEEPER'
  const userRole = await prisma.user.findFirst({
    where: {
      email: email,
      OR: [
        { role: Role.OWNER },
        { role: Role.INVENTORY_MANAGER },
        { role: Role.SHOPKEEPER },
      ],
    },
  });

  if (!userRole) {
    sendResponse({
      res,
      statusCode: 403,
      status: "error",
      message: "User is not an Owner or Shopkeeper",
    });
    return;
  }

  next(); // Jika pengguna adalah Owner atau Shopkeeper, lanjutkan ke proses berikutnya
};
