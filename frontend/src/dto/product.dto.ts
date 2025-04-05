export enum ProductStatus {
  AVAILABLE = "AVAILABLE", // Produk tersedia untuk dijual
  COMMING_SOON = "COMMING_SOON", // Produk akan datang
  DELETED = "DELETED", // Produk dihapus dari daftar
  ARCHIVED = "ARCHIVED", // Produk diarsipkan
  SUSPENDED = "SUSPENDED" // Produk dihentikan sementara
}

export enum DiscountType {
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
  description: string | null;
  logoUrl: string | null;
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
  id?: number | null;
  name: string;
  description?: string | null;
  retailPrice: number;
  wholesalePrice?: number | null;
  minWholesaleQty?: number | null;
  sku?: string | null;
  productStatus?: ProductStatus | null;

  // inventory
  locationName?: string | null;
  quantityInStock: number;
  minimumStock?: number | null;

  // relationship
  categories?: string[] | null;
  imageUrls?: string[] | null;
  discount?: DiscountDTO | null;
  brand?: BrandDTO | null;
}

export interface ProductFilters {
  page: number;
  pageSize: number;
  search?: string;
  status?: string;
  category?: string;
  stockLevel?: string;
  priceMin?: number | null;
  priceMax?: number | null;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}