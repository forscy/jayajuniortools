// src/routes/auth.routes.ts
import { Router } from "express";
import {
  signUp,
  signIn,
  changePassword,
  createAccount,
  suspendAccount,
  deleteAccount,
  editAccount,
  isAuthenticated,
} from "../controllers/auth.controller";
import {
  authenticateJWT,
  verifyOwnerRole,
} from "../middlewares/auth.middleware";

const router = Router();

// Check if user is authenticated
router.get("/is-authenticated", authenticateJWT, isAuthenticated);

// Route untuk SignUp
router.post("/signup", signUp);

// Route untuk SignIn
router.post("/signin", signIn);

// Route untuk Change Password (dilindungi dengan autentikasi JWT)
router.put("/change-password", authenticateJWT, changePassword);

// Route untuk membuat akun baru (hanya bisa diakses oleh Owner)
router.post("/create-account", authenticateJWT, verifyOwnerRole, createAccount);

// Route untuk suspend account (hanya bisa diakses oleh Owner)
router.post(
  "/suspend-account",
  authenticateJWT,
  verifyOwnerRole,
  suspendAccount
);

// Route untuk men'ghapus akun pengguna (hanya bisa diakses oleh Owner)
router.post("/delete-account", authenticateJWT, verifyOwnerRole, deleteAccount);

// Route untuk mengedit akun pengguna (hanya bisa diakses oleh Owner)
router.put("/edit-account", authenticateJWT, verifyOwnerRole, editAccount);

export default router;
