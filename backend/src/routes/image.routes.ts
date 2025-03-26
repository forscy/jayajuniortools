// src/routes/image.routes.ts
import express from "express";
import { upload } from "../config/storage.config";
import { ImageService } from "../services/image.service";
import { ImageController } from "../controllers/image.controller";

const router = express.Router();
const imageService = new ImageService();
const imageController = new ImageController(imageService);

// Route untuk upload gambar produk dengan opsi kompresi
router.post("/upload", upload.single("image"), imageController.uploadImage);

// Route untuk menghapus gambar produk
router.delete("/:filename", imageController.deleteImage);

export default router;
