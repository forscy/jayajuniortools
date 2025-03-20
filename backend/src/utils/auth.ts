// src/utils/password.ts
import { Response } from "express";
import bcrypt from "bcryptjs";


const SALT_ROUNDS = 10;

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const comparePassword = async (plainPassword: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};


export const setTokenCookies = (res: Response, token: string) => {
  try {
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Only set secure in production
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax", // none for cross-site, lax for dev
      maxAge: 1000 * 60 * 60 * 24 * 7, // 7 days in milliseconds
      path: "/", // Ensure cookie is available site-wide
    });
  } catch (error) {
    throw new Error(`Error setting token cookies: ${error}`);
  }
};


// delete cookie
export const clearTokenCookie = (res: Response) => {
  try {
    res.clearCookie("token");
  } catch (error) {
    throw new Error(`Error deleting token cookies: ${error}`);
  }
};