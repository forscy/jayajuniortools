// src/utils/responseWrapper.ts

interface IResponse {
  status: 'success' | 'error';
  message: string;
  data?: any;
}

export const sendResponse = (res: any, statusCode: number, status: 'success' | 'error', message: string, data?: any) => {
  const response: IResponse = {
    status,
    message,
    data: data || null, // Jika tidak ada data, kirim null
  };

  res.status(statusCode).json(response);
};
