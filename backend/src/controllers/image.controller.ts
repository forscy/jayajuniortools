// src/controllers/image.controller.ts
import { Request, Response } from "express";
import { ImageService } from "../services/image.service";
import fs from "fs";
import { sendResponse } from "../utils/responseWrapper";

interface CompressionQueryOptions {
  quality?: number;
  format?: "jpeg" | "png" | "webp" | null;
  maxWidth?: number | null;
  maxHeight?: number | null;
}

export class ImageController {
  constructor(private imageService: ImageService) {}

  /**
   * Parse opsi kompresi dari query parameters
   */
  private parseCompressionOptions(req: Request): CompressionQueryOptions {
    const options: CompressionQueryOptions = {};

    if (req.query.quality && !isNaN(Number(req.query.quality))) {
      options.quality = Math.min(100, Math.max(1, Number(req.query.quality)));
    }

    if (
      req.query.format &&
      ["jpeg", "png", "webp", "original"].includes(req.query.format as string)
    ) {
      options.format =
        req.query.format === "original"
          ? null
          : (req.query.format as "jpeg" | "png" | "webp");
    }

    if (req.query.maxWidth && !isNaN(Number(req.query.maxWidth))) {
      options.maxWidth =
        Number(req.query.maxWidth) > 0 ? Number(req.query.maxWidth) : null;
    }

    if (req.query.maxHeight && !isNaN(Number(req.query.maxHeight))) {
      options.maxHeight =
        Number(req.query.maxHeight) > 0 ? Number(req.query.maxHeight) : null;
    }

    return options;
  }

  /**
   * Upload gambar produk dengan opsi kompresi
   */
  uploadImage = async (req: Request, res: Response) => {
    try {
      const { rename } = req.body;
      if (!req.file) {
        return sendResponse({
          res,
          statusCode: 400,
          status: "error",
          message: "Tidak ada file yang diupload",
        });
      }

      // Parse opsi kompresi dari query parameters
      const compressionOptions = this.parseCompressionOptions(req);

      // Proses dan simpan gambar
      const processResult = await this.imageService.processAndSaveImage(
        req.file.path,
        req.file.originalname,
        rename,
        {
          quality: compressionOptions.quality,
          convertToFormat: compressionOptions.format,
          maxWidth: compressionOptions.maxWidth,
          maxHeight: compressionOptions.maxHeight,
        }
      );

      // Dapatkan URL gambar
      const imageUrl = this.imageService.getImageUrl(processResult.filename);

      return sendResponse({
        res,
        statusCode: 200,
        status: "success",
        message: "Gambar berhasil diupload dan diproses",
        data: {
          filename: processResult.filename,
          imageUrl,
          format: processResult.format,
          width: processResult.width,
          height: processResult.height,
          size: processResult.size,
          originalSize: processResult.originalSize,
          compressionRatio: `${processResult.compressionRatio.toFixed(2)}%`,
        },
      });
    } catch (error) {
      console.error("Error saat upload:", error);
      // Hapus file temporary jika ada error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }
      return sendResponse({
        res,
        statusCode: 500,
        status: "error",
        message: "Gagal mengupload dan memproses gambar",
      });
    }
  };

  /**
   * Menghapus gambar produk
   */
  deleteImage = async (req: Request, res: Response) => {
    try {
      const { filename } = req.params;

      if (!filename) {
        return sendResponse({
          res,
          statusCode: 400,
          status: "error",
          message: "Filename tidak diberikan",
        });
      }

      const deleted = await this.imageService.deleteImage(filename);

      if (deleted) {
        return sendResponse({
          res,
          statusCode: 200,
          status: "success",
          message: "Gambar berhasil dihapus",
        });
      } else {
        return sendResponse({
          res,
          statusCode: 404,
          status: "error",
          message: "Gambar tidak ditemukan",
        });
      }
    } catch (error) {
      console.error("Error saat menghapus:", error);
      return sendResponse({
        res,
        statusCode: 500,
        status: "error",
        message: "Gagal menghapus gambar",
      });
    }
  };
}
