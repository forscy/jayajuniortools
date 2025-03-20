import axios, { AxiosInstance, AxiosError } from "axios";

// Definisikan tipe umum untuk struktur respons API dengan code numerik
export interface ApiResponse<T> {
  status: "success" | "error";
  message: string;
  data: T;
  pagination?: {
    totalItems: number;
    pageSize: number;
    totalPages: number;
    page: number;
  };
}

export abstract class BaseController {
  protected api: AxiosInstance;

  constructor(baseURL: string, withCredentials = true) {
    this.api = axios.create({
      baseURL,
      withCredentials: withCredentials, // Jika perlu, bisa sesuaikan
    });
  }

  // Metode GET umum untuk mengambil data dengan struktur respons yang sesuai
  protected async get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.get<ApiResponse<T>>(url, { params });
      return response.data; // Kembalikan struktur data lengkap (message, code, data, pagination)
    } catch (error) {
      this.handleError(error);
    }
  }

  // Metode POST umum untuk menambah data
  protected async post<T>(url: string, data: any): Promise<ApiResponse<T>> {
    try {
      const response = await this.api.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Metode PUT umum untuk mengubah data, hanya untuk admin
  protected async put<T>(
    url: string,
    data: any,
    userRole?: string
  ): Promise<ApiResponse<T>> {
    // if (userRole !== 'admin') {
    //   throw new Error('Unauthorized: Only admin can perform this action');
    // }

    try {
      const response = await this.api.put<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Metode DELETE umum untuk menghapus data, hanya untuk admin
  protected async delete<T>(
    url: string,
    userRole?: string
  ): Promise<ApiResponse<T>> {
    // if (userRole !== 'admin') {
    //   throw new Error('Unauthorized: Only admin can perform this action');
    // }

    try {
      const response = await this.api.delete<ApiResponse<T>>(url);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  // Metode umum untuk menangani error dari Axios
  private handleError(error: unknown): never {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<ApiResponse<any>>;

      if (axiosError.response && axiosError.response.data) {
        // Jika error memiliki data di response, gunakan pesan dari server
        throw new Error(
          axiosError.response.data.message || "An error occurred"
        );
      } else if (axiosError.request) {
        // Error saat mengirim permintaan, tetapi tidak ada respons
        throw new Error("No response received from server");
      } else {
        // Error saat membuat permintaan
        throw new Error(axiosError.message);
      }
    } else {
      // Jika error bukan dari Axios
      throw new Error("An unexpected error occurred");
    }
  }
}
