export enum ProductStatus {
  AVAILABLE = "AVAILABLE", // Produk tersedia untuk dijual
  COMMING_SOON = "COMMING_SOON", // Produk akan datang
  DELETED = "DELETED", // Produk dihapus dari daftar
  ARCHIVED = "ARCHIVED", // Produk diarsipkan
  SUSPENDED = "SUSPENDED" // Produk dihentikan sementara
}

enum DiscountType {
  PERCENTAGE = "PERCENTAGE", // Diskon persentase (mis. 10%)
  FIXED = "FIXED", // Diskon nominal tetap (mis. Rp 10.000)
  BUY_X_GET_Y = "BUY_X_GET_Y", // Beli X gratis Y (implementasi detail bisa di aplikasi)
}

export interface DiscountDTO {
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase?: number;
  startDate: Date;
  endDate: Date;
  isActive?: boolean;
}

export interface BrandDTO {
  name: string;
  description: string;
  logoUrl: string;
}

export interface InventoryDTO {
  locationName?: string;
  quantityInStock: number;
  minimumStock: number;
}

// review dto
export interface ReviewDTO {
  rating: number;
  comment: string;
}

// dto for create product
export interface ProductDTO {
  id?: number;
  name: string;
  description?: string;
  retailPrice: number;
  wholesalePrice?: number;
  minWholesaleQty?: number;
  sku?: string;
  productStatus?: ProductStatus | null;

  // inventory
  quantityInStock: number;
  locationName?: string;
  minimumStock?: number;

  // relationship
  categories?: string[];
  imageUrls?: string[];
  discount?: DiscountDTO;
  brand?: BrandDTO;
}
