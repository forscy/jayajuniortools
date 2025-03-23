// src/types/express.d.ts
// Tambahkan ini agar TypeScript mengenali properti file pada Request
declare namespace Express {
  export interface Request {
    file?: Multer.File;
    files?: {
      [fieldname: string]: Multer.File[];
    } | Multer.File[];
  }
}