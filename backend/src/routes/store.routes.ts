// src/routes/store.routes.ts
import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { verifyOwnerRole } from '../middlewares/auth.middleware'; // Import middleware untuk verifikasi role
import { getStore, updateStore } from '../controllers/store.controller';

const router = Router();

// mengambil informasi toko
router.get('/profile', getStore);

// Route untuk mengelola informasi dasar toko (hanya bisa diakses oleh Owner)
router.put('/update-store', authenticateJWT, verifyOwnerRole, updateStore);

export default router;
