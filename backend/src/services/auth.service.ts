// src/services/auth.service.ts
import bcrypt, { compare } from "bcryptjs";
import { prisma } from "../config/client.config";
import { Role, UserStatus } from "@prisma/client";
import {
  comparePassword,
  generateToken,
  hashPassword,
} from "../utils/auth.util";

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
        status: UserStatus.ACTIVE,
        role: Role.BUYER,
      },
    });

    const token = generateToken({ ...newUser, password: undefined });

    return {
      message: "User registered successfully",
      token,
      user: { ...newUser, password: undefined },
    };
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

    const isMatch = await comparePassword(password, user.password!);

    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = generateToken({ ...user, password: undefined });

    return {
      message: "SignIn successful",
      token: token,
      user: { ...user, password: undefined },
    };
  } catch (error: any) {
    throw new Error(error.message || "Error during SignIn");
  }
};

export const changePasswordService = async (
  email: string,
  oldPassword: string,
  newPassword: string
) => {
  try {
    // Temukan user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Cek apakah password lama cocok
    const isMatch = await bcrypt.compare(oldPassword, user.password!);

    if (!isMatch) {
      throw new Error("Old password is incorrect");
    }

    // Hash password baru
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password di database
    await prisma.user.update({
      where: { email: email },
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
      email: newUser.email,
      role: role,
    };
  } catch (error: any) {
    throw new Error(error.message || "Failed to create user");
  }
};

interface SuspendAccountData {
  email: string;
}

export const suspendAccountService = async ({ email }: SuspendAccountData) => {
  try {
    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Update status menjadi SUSPENDED
    const suspendedUser = await prisma.user.update({
      where: { email: email },
      data: { status: UserStatus.SUSPENDED },
    });

    return {
      message: "User suspended successfully",
      email: suspendedUser.email,
    };
  } catch (error: any) {
    throw new Error(error.message || "Error during account suspension");
  }
};

interface DeleteAccountData {
  email: string;
}

export const deleteAccountService = async ({ email }: DeleteAccountData) => {
  try {
    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    await prisma.wishlist.deleteMany({
      where: {
        userId: user.id,
      },
    });

    // Hapus akun pengguna
    await prisma.user.delete({
      where: { email: email },
    });

    return { message: "User deleted successfully", email };
  } catch (error: any) {
    throw new Error(error.message || "Error during account deletion");
  }
};

interface EditAccountData {
  email: string;
  name?: string;
  role?: Role;
  status?: UserStatus;
}

export const editAccountService = async ({
  name,
  email,
  role,
  status,
}: EditAccountData) => {
  try {
    // Cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email: email },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Perbarui data pengguna
    const updatedUser = await prisma.user.update({
      where: { email: email },
      data: {
        name: name ?? user.name,
        email: email ?? user.email,
        status: status ?? user.status,
        role: role ?? user.role,
      },
    });

    return { message: "User updated successfully", email: updatedUser.email };
  } catch (error: any) {
    throw new Error(error.message || "Error during account update");
  }
};
