// src/routes/auth.routes.ts
import { Router } from 'express';
import { signUp, signIn, changePassword, createAccount } from '../controllers/auth.controller';
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


export default router;