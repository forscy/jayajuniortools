// src/utils/responseWrapper.ts

interface IResponse {
  status: 'success' | 'error';
  message: string;
  data?: any;
  pagination?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  } | undefined;
}

export const sendResponse = (res: any, statusCode: number, status: 'success' | 'error', message: string, data?: any, pagination?: any) => {
  const response: IResponse = {
    status,
    message,
    data: data || null, // Jika tidak ada data, kirim null
    pagination: pagination || undefined // Jika tidak ada pagination, kirim undefined
  };

  res.status(statusCode).json(response);
};
