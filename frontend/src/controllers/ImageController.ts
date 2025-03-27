import { BaseController, ApiResponse } from "./BaseController";
import { BASE_API_URL } from "../types/constants";

/**
 * Response type for image upload
 */
export interface ImageUploadResponse {
  filename: string;
  originalName: string;
  path: string;
  size: number;
  imageUrl: string;
}

/**
 * Response type for multiple image uploads
 */
export interface MultipleImageUploadResponse {
  uploadedFiles: ImageUploadResponse[];
  failedFiles: { name: string; error: string }[];
}

/**
 * Response type for image deletion
 */
export interface ImageDeleteResponse {
  filename: string;
  success: boolean;
}

class ImageController extends BaseController {
  constructor() {
    super(`${BASE_API_URL}/images`);
  }

  /**
   * Upload a single image to the server
   * @param file The file to upload
   * @param compress Whether to compress the image (optional)
   * @returns Promise with uploaded image info
   */
  async uploadImage(
    file: File,
    compress: boolean = true
  ): Promise<ApiResponse<ImageUploadResponse>> {
    this.setAuthHeader(); // Set authentication header

    const formData = new FormData();
    formData.append("image", file);

    // Add compression option if needed
    if (compress) {
      formData.append("compress", "true");
    }

    // Use custom headers for multipart/form-data
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await this.api.post<ApiResponse<ImageUploadResponse>>(
        "/upload",
        formData,
        config
      );
      return response.data;
    } catch (error) {
      // Throw error to be consistent with BaseController pattern
      throw this.formatError(error);
    }
  }

  /**
   * Upload multiple images to the server
   * @param files Array of files to upload
   * @param compress Whether to compress the images (optional)
   * @returns Promise with uploaded images info
   */
  async uploadMultipleImages(
    files: File[],
    compress: boolean = true
  ): Promise<ApiResponse<MultipleImageUploadResponse>> {
    this.setAuthHeader(); // Set authentication header

    const formData = new FormData();

    // Append each file to the form data
    files.forEach((file) => {
      formData.append(`images`, file);
    });

    // Add compression option if needed
    if (compress) {
      formData.append("compress", "true");
    }

    // Use custom headers for multipart/form-data
    const config = {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    };

    try {
      const response = await this.api.post<
        ApiResponse<MultipleImageUploadResponse>
      >("/upload-multiple", formData, config);
      return response.data;
    } catch (error) {
      // Throw error to be consistent with BaseController pattern
      throw this.formatError(error);
    }
  }

  /**
   * Delete an image from the server
   * @param filename The filename to delete
   * @returns Promise with deletion result
   */
  async deleteImage(
    filename: string
  ): Promise<ApiResponse<ImageDeleteResponse>> {
    this.setAuthHeader(); // Set authentication header
    return await this.delete<ImageDeleteResponse>(`/${filename}`);
  }

  /**
   * Format error messages consistently
   * @param error The error to format
   * @returns Formatted error
   */
  private formatError(error: unknown): Error {
    if (error instanceof Error) {
      return new Error(`Image operation failed: ${error.message}`);
    }
    return new Error("Image operation failed with an unknown error");
  }
}

// Create and export a singleton instance
const imageController = new ImageController();
export default imageController;
