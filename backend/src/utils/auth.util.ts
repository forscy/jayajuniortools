// src/utils/password.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const SALT_ROUNDS = 10;

export const dayToSecond = (day: number) => {
  return day * 24 * 60 * 60;
};

export const hourToSecond = (hour: number) => {
  return hour * 60 * 60;
};

export const hashPassword = async (plainPassword: string): Promise<string> => {
  return await bcrypt.hash(plainPassword, SALT_ROUNDS);
};

export const comparePassword = async (
  plainPassword: string,
  hashedPassword: string
): Promise<boolean> => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

// extract token from bearer request headers
export const extractBearerToken = (req: any): string => {
  return req.headers["authorization"]?.split(" ")[1];
};

// generate jwt token
export const generateToken = (payload: any): string => {
  return jwt.sign(payload, process.env.JWT_SECRET!, {
    expiresIn: dayToSecond(30),
  });
};

// Verify token
export const verifyToken = (
  token: string
): { valid: boolean; message?: string; payload?: any } => {
  try {
    // Coba verifikasi token dan kembalikan payload jika valid
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    return { valid: true, payload }; // Jika token valid, kembalikan payload
  } catch (error: any) {
    // Jika terjadi error, kembalikan pesan error
    return { valid: false, message: error.message || "Invalid token" };
  }
};
