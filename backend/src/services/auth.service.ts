// src/services/auth.service.ts
import bcrypt, { compare } from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../config/client";
import { Role, UserStatus } from "@prisma/client";
import { comparePassword, hashPassword } from "../utils/auth";

export const signUpService = async (
  name: string,
  email: string,
  password: string
) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return { userId: newUser.id, message: "User registered successfully" };
  } catch (error: any) {
    throw new Error(error.message || "Error during SignUp");
  }
};

export const signInService = async (email: string, password: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET!,
      { expiresIn: "1h" }
    );

    return { token, message: "SignIn successful" };
  } catch (error: any) {
    throw new Error(error.message || "Error during SignIn");
  }
};

export const changePasswordService = async (
  userId: number,
  oldPassword: string,
  newPassword: string
) => {
  try {
    // Temukan user berdasarkan userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Cek apakah password lama cocok
    const isMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    // Hash password baru
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password di database
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedNewPassword },
    });

    return { message: "Password updated successfully" };
  } catch (error: any) {
    throw new Error(error.message || "Error during password change");
  }
};

interface CreateAccountData {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export const createAccountService = async ({
  name,
  email,
  password,
  role,
}: CreateAccountData) => {
  try {
    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    // Buat user baru
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: await hashPassword(password),
        status: UserStatus.ACTIVE,
        role: role,
      },
    });

    return {
      message: "User created successfully",
      userId: newUser.id,
      role: role,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to create user");
  }
};


interface SuspendAccountData {
  userId: number;
}

export const suspendAccountService = async ({ userId }: SuspendAccountData) => {
  try {
    // Cari user berdasarkan userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Update status menjadi SUSPENDED
    const suspendedUser = await prisma.user.update({
      where: { id: userId },
      data: { status: UserStatus.SUSPENDED },
    });

    return { message: 'User suspended successfully', userId: suspendedUser.id };
  } catch (error: any) {
    throw new Error(error.message || 'Error during account suspension');
  }
};


interface DeleteAccountData {
  userId: number;
}

export const deleteAccountService = async ({ userId }: DeleteAccountData) => {
  try {
    // Cari user berdasarkan userId
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error('User not found');
    }

    await prisma.wishlist.deleteMany({
      where: {
        userId: userId,
      },
    });

    // Hapus akun pengguna
    await prisma.user.delete({
      where: { id: userId },
    });

    return { message: 'User deleted successfully', userId };
  } catch (error: any) {
    throw new Error(error.message || 'Error during account deletion');
  }
};
