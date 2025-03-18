// src/routes/auth.routes.ts
import { Router } from 'express';
import { signUp, signIn, changePassword, createAccount, suspendAccount, deleteAccount } from '../controllers/auth.controller';
import { authenticateJWT, verifyOwnerRole } from '../middlewares/auth.middleware';

const router = Router();

// Route untuk SignUp
router.post('/signup', signUp);

// Route untuk SignIn
router.post('/signin', signIn);

// Route untuk Change Password (dilindungi dengan autentikasi JWT)
router.put('/change-password', authenticateJWT, changePassword);

// Route untuk membuat akun baru (hanya bisa diakses oleh Owner)
router.post('/create-account', authenticateJWT, verifyOwnerRole, createAccount);

// Route untuk suspend account (hanya bisa diakses oleh Owner)
router.post('/suspend-account', authenticateJWT, verifyOwnerRole, suspendAccount);

// Route untuk menghapus akun pengguna (hanya bisa diakses oleh Owner)
router.post('/delete-account', authenticateJWT, verifyOwnerRole, deleteAccount);


export default router;