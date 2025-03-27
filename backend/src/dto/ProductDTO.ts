import { DiscountType } from "@prisma/client";

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
