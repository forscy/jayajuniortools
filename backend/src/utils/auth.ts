// src/utils/password.ts
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


const SALT_ROUNDS = 10;

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
  return jwt.sign(payload, process.env.JWT_SECRET!, { expiresIn: "1h" });
};