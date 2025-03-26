// src/services/image.service.ts
import fs from "fs";
import path from "path";
import { promisify } from "util";
import sharp from "sharp";
import { storageConfig } from "../config/storage.config";
import { BASE_URL } from "../config/constant.config";
import { v4 as uuidv4 } from "uuid";

const unlinkAsync = promisify(fs.unlink);
const writeFileAsync = promisify(fs.writeFile);

/**
 * Fungsi untuk menghapus file dengan mekanisme retry
 */
const safelyDeleteFile = async (
  filePath: string,
  maxRetries = 5,
  retryDelay = 300
): Promise<void> => {
  if (!fs.existsSync(filePath)) {
    return;
  }

  let lastError: Error | null = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      await unlinkAsync(filePath);
      return; // Sukses menghapus
    } catch (error: any) {
      lastError = error;

      // Retry hanya untuk error EBUSY
      if (error.code === "EBUSY") {
        console.log(
          `File ${filePath} sibuk, menunggu ${retryDelay}ms sebelum mencoba lagi. Percobaan: ${attempt + 1}/${maxRetries}`
        );
        await new Promise((resolve) => setTimeout(resolve, retryDelay));
        continue;
      }

      // Error lain, log dan return
      console.warn(`Gagal menghapus file ${filePath}:`, error);
      return;
    }
  }

  if (lastError) {
    console.warn(
      `Gagal menghapus file ${filePath} setelah ${maxRetries} percobaan:`,
      lastError
    );
  }
};

interface CompressionOptions {
  quality?: number;
  convertToFormat?: "jpeg" | "png" | "webp" | null;
  maxWidth?: number | null;
  maxHeight?: number | null;
}

interface ImageProcessingResult {
  filename: string;
  format: string;
  width: number;
  height: number;
  size: number;
  originalSize: number;
  compressionRatio: number;
}

interface IImageService {
  getImageUrl(filename: string): string;
  deleteImage(filename: string): Promise<boolean>;
  getImagePath(filename: string): string;
  processAndSaveImage(
    tempFilePath: string,
    originalFilename: string,
    newFilename?: string | undefined,
    options?: CompressionOptions
  ): Promise<ImageProcessingResult>;
}

export class ImageService implements IImageService {
  constructor(private baseUrl: string = BASE_URL) {}

  /**
   * Mendapatkan URL publik dari gambar
   */
  getImageUrl(filename: string): string {
    return `${this.baseUrl}/uploads/products/${filename}`;
  }

  /**
   * Mendapatkan path file di server
   */
  getImagePath(filename: string): string {
    return path.join(storageConfig.uploadDir, filename);
  }

  /**
   * Memproses dan menyimpan gambar dengan opsi kompresi
   */
  async processAndSaveImage(
    tempFilePath: string,
    originalFilename: string,
    rename: string | undefined,
    options?: CompressionOptions
  ): Promise<ImageProcessingResult> {
    // Gabungkan opsi default dengan opsi yang diberikan
    const processOptions: CompressionOptions = {
      quality: options?.quality || storageConfig.compression.quality,
      convertToFormat:
        options?.convertToFormat ||
        (storageConfig.compression.convertToFormat as "jpeg" | "png" | "webp"),
      maxWidth:
        options?.maxWidth !== undefined
          ? options?.maxWidth
          : storageConfig.compression.maxWidth,
      maxHeight:
        options?.maxHeight !== undefined
          ? options?.maxHeight
          : storageConfig.compression.maxHeight,
    };

    let outputPath = "";

    try {
      // Membaca file ke buffer terlebih dahulu
      const imageBuffer = fs.readFileSync(tempFilePath);

      // Mulai proses dengan Sharp
      let sharpInstance = sharp(imageBuffer);

      // Dapatkan info gambar asli
      const originalFileStats = fs.statSync(tempFilePath);
      const originalSize = originalFileStats.size;

      // Dapatkan metadata gambar
      const metadata = await sharpInstance.metadata();

      // Resize jika perlu
      if (processOptions.maxWidth || processOptions.maxHeight) {
        sharpInstance = sharpInstance.resize({
          width: processOptions.maxWidth || undefined,
          height: processOptions.maxHeight || undefined,
          fit: "inside", // Mempertahankan aspect ratio
          withoutEnlargement: true, // Tidak memperbesar gambar yang lebih kecil
        });
      }

      // Tentukan format output
      const outputFormat =
        processOptions.convertToFormat ||
        (metadata.format as "jpeg" | "png" | "webp") ||
        "jpeg";

      // Terapkan format dan kompresi
      switch (outputFormat) {
        case "jpeg":
          sharpInstance = sharpInstance.jpeg({
            quality: processOptions.quality,
          });
          break;
        case "png":
          sharpInstance = sharpInstance.png({
            quality: processOptions.quality,
          });
          break;
        case "webp":
          sharpInstance = sharpInstance.webp({
            quality: processOptions.quality,
          });
          break;
      }

      // Buat nama file baru dengan ekstensi yang sesuai
      const filenameWithoutExt = rename || path.parse(originalFilename).name;
      const newFilename = `${filenameWithoutExt}_${uuidv4()}.${outputFormat}`;
      outputPath = path.join(storageConfig.uploadDir, newFilename);

      // Gunakan toBuffer dan writeFileAsync untuk menghindari masalah file locking
      const outputBuffer = await sharpInstance.toBuffer();

      // Tulis file secara asinkron
      await writeFileAsync(outputPath, outputBuffer);

      // Dapatkan info file hasil
      const processedStats = fs.statSync(outputPath);
      const outputInfo = await sharp(outputPath).metadata();

      // Hapus file sementara dengan mekanisme retry yang aman
      // Jangan tunggu penghapusan selesai untuk tidak menghambat respons
      setTimeout(() => {
        safelyDeleteFile(tempFilePath);
      }, 200);

      return {
        filename: newFilename,
        format: outputFormat,
        width: outputInfo.width || 0,
        height: outputInfo.height || 0,
        size: processedStats.size,
        originalSize: originalSize,
        compressionRatio:
          originalSize > 0
            ? ((originalSize - processedStats.size) / originalSize) * 100
            : 0,
      };
    } catch (error) {
      console.error("Error processing image:", error);

      // Jika terjadi error dan file output sudah dibuat, coba hapus
      if (outputPath && fs.existsSync(outputPath)) {
        safelyDeleteFile(outputPath);
      }

      throw new Error("Gagal memproses gambar");
    }
  }

  /**
   * Menghapus gambar dari sistem file dengan mekanisme retry
   */
  async deleteImage(filename: string): Promise<boolean> {
    const filePath = this.getImagePath(filename);

    if (!fs.existsSync(filePath)) {
      return false; // File tidak ada
    }

    try {
      const maxRetries = 5;
      const retryDelay = 500; // ms

      // Fungsi untuk mencoba menghapus dengan delay
      const tryDelete = async (attemptsLeft: number): Promise<boolean> => {
        try {
          await unlinkAsync(filePath);
          return true;
        } catch (error: any) {
          if (error.code === "EBUSY" && attemptsLeft > 0) {
            // Jika file sibuk dan masih ada kesempatan retry
            console.log(
              `File sibuk, mencoba lagi dalam ${retryDelay}ms. Sisa percobaan: ${attemptsLeft}`
            );
            await new Promise((resolve) => setTimeout(resolve, retryDelay));
            return tryDelete(attemptsLeft - 1);
          }

          console.error("Error saat menghapus file:", error);
          return false;
        }
      };

      return await tryDelete(maxRetries);
    } catch (error) {
      console.error("Error saat menghapus file:", error);
      return false;
    }
  }
}
