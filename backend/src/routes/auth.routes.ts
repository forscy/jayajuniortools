// src/routes/auth.routes.ts
import { Router } from 'express';
import { signUp, signIn } from '../controllers/auth.controller';

const router = Router();

// Route untuk SignUp
router.post('/signup', signUp);

// Route untuk SignIn
router.post('/signin', signIn);

export default router;