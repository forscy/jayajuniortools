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

/**
 * @swagger
 * /api/auth/is-authenticated:
 *   get:
 *     summary: Check if user is authenticated
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User is authenticated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     isAuthenticated:
 *                       type: boolean
 *                     user:
 *                       type: object
 *       401:
 *         description: Unauthorized
 */
router.get("/is-authenticated", authenticateJWT, isAuthenticated);

/**
 * @swagger
 * /api/auth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: Bad request
 */
router.post("/signup", signUp);

/**
 * @swagger
 * /api/auth/signin:
 *   post:
 *     summary: Authenticate a user
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 */
router.post("/signin", signIn);

/**
 * @swagger
 * /api/auth/change-password:
 *   put:
 *     summary: Change user password
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put("/change-password", authenticateJWT, changePassword);

/**
 * @swagger
 * /api/auth/create-account:
 *   post:
 *     summary: Create a new account (Owner only)
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - role
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [SHOPKEEPER, INVENTORY_MANAGER]
 *     responses:
 *       201:
 *         description: Account created successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/create-account", authenticateJWT, verifyOwnerRole, createAccount);

/**
 * @swagger
 * /api/auth/suspend-account:
 *   post:
 *     summary: Suspend a user account (Owner only)
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account suspended successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post(
  "/suspend-account",
  authenticateJWT,
  verifyOwnerRole,
  suspendAccount
);

/**
 * @swagger
 * /api/auth/delete-account:
 *   post:
 *     summary: Delete a user account (Owner only)
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Account deleted successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.post("/delete-account", authenticateJWT, verifyOwnerRole, deleteAccount);

/**
 * @swagger
 * /api/auth/edit-account:
 *   put:
 *     summary: Edit a user account (Owner only)
 *     tags: [Account Management]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *                 enum: [BUYER, SHOPKEEPER, INVENTORY_MANAGER, OWNER]
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, SUSPENDED]
 *     responses:
 *       200:
 *         description: Account updated successfully
 *       400:
 *         description: Bad request
 *       401:
 *         description: Unauthorized
 */
router.put("/edit-account", authenticateJWT, verifyOwnerRole, editAccount);

export default router;
