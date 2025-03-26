// src/config/storage.config.ts
import path from 'path';
import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';

// Konfigurasi direktori penyimpanan
const storageConfig = {
  uploadDir: path.join(process.cwd(), 'uploads/products'),
  maxFileSize: 5 * 1024 * 1024, // 5MB
  allowedFileTypes: ['image/jpeg', 'image/png', 'image/webp'],
  // Konfigurasi kompresi default
  compression: {
    enabled: true,
    quality: 80, // 0-100, dimana 100 adalah kualitas maksimum
    convertToFormat: 'webp', // null, 'jpeg', 'png', 'webp'
    maxWidth: 1200, // max width dalam pixel, null = tidak diubah
    maxHeight: 1200 // max height dalam pixel, null = tidak diubah
  }
};

// Konfigurasi multer untuk penyimpanan file sementara
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), 'temp'));
  },
  filename: (req, file, cb) => {
    const fileExt = path.extname(file.originalname);
    const fileName = `temp_${uuidv4()}${fileExt}`;
    cb(null, fileName);
  }
});

// Filter file berdasarkan tipe
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (storageConfig.allowedFileTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Format file tidak didukung. Gunakan JPG, PNG, atau WebP.'));
  }
};

// Inisialisasi multer dengan konfigurasi
const upload = multer({
  storage: storage,
  limits: {
    fileSize: storageConfig.maxFileSize
  },
  fileFilter: fileFilter
});

// Pastikan direktori ada
import fs from 'fs';
if (!fs.existsSync(storageConfig.uploadDir)) {
  fs.mkdirSync(storageConfig.uploadDir, { recursive: true });
}
if (!fs.existsSync(path.join(process.cwd(), 'temp'))) {
  fs.mkdirSync(path.join(process.cwd(), 'temp'), { recursive: true });
}

export { storageConfig, upload };

