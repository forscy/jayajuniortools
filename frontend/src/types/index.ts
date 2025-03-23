// src/types/index.ts

export enum ResponseMessage {
  success = "success",
  error = "error",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum Role {
  OWNER = "OWNER",
  INVENTORY_MANAGER = "INVENTORY_MANAGER",
  BUYER = "BUYER",
  SHOPKEEPER = "SHOPKEEPER",
}

export enum DiscountType {
  PERCENTAGE = "PERCENTAGE",
  FIXED = "FIXED",
  BUY_X_GET_Y = "BUY_X_GET_Y"
}

export enum Day {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY"
}

export interface User {
  id: number;
  name: string;
  email: string;
  password?: string;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  role: Role;
  wishlist?: Wishlist[];
  reviews?: Review[];
}

export interface Product {
  id: number;
  name: string;
  description?: string;
  retailPrice: number;
  wholesalePrice?: number;
  minWholesaleQty?: number;
  sku?: string;
  createdAt: string;
  updatedAt: string;
  categories?: ProductCategory[];
  images?: ProductImage[];
  discount?: ProductDiscount;
  reviews?: Review[];
  wishlist?: Wishlist[];
  inventoryId: number;
  inventory?: Inventory;
  brandId?: number;
  brand?: Brand;
}

export interface Brand {
  id: number;
  name: string;
  description?: string;
  logoUrl?: string;
  createdAt: string;
  updatedAt: string;
  products?: Product[];
}

export interface Review {
  id: number;
  productId: number;
  userId: number;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
  product?: Product;
  user?: User;
}

export interface ProductDiscount {
  id: number;
  productId: number;
  name: string;
  description?: string;
  discountType: DiscountType;
  discountValue: number;
  minPurchase?: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  product?: Product;
}

export interface Inventory {
  id: number;
  locationName: string;
  quantityInStock: number;
  minimumStock: number;
  lastUpdated: string;
  product?: Product;
  inventorySuppliers?: InventorySupplier[];
}

export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  address: string;
  createdAt: string;
  updatedAt: string;
  inventorySuppliers?: InventorySupplier[];
}

export interface InventorySupplier {
  id: number;
  inventoryId: number;
  supplierId: number;
  createdAt: string;
  updatedAt: string;
  inventory?: Inventory;
  supplier?: Supplier;
}

export interface Wishlist {
  id: number;
  email: string;
  productId: number;
  createdAt: string;
  user?: User;
  product?: Product;
}

export interface ProductImage {
  id: number;
  productId: number;
  url: string;
  product?: Product;
}

export interface Category {
  id: number;
  name: string;
  description?: string;
  products?: ProductCategory[];
}

export interface ProductCategory {
  id: number;
  productId: number;
  categoryId: number;
  product?: Product;
  category?: Category;
}

export interface Store {
  id: number;
  name: string;
  address: string;
  phone?: string;
  email?: string;
  description?: string;
  logo?: string;
  banner?: string;
  operationalHours?: OperationalHour[];
}

export interface OperationalHour {
  id: number;
  storeId: number;
  day: Day;
  openTime: string;
  closeTime: string;
  store?: Store;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

export enum OrderStatus {
  PENDING = "PENDING",
  PROCESSED = "PROCESSED",
  SHIPPED = "SHIPPED",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface Order {
  id: number;
  status: OrderStatus;
  createdAt: string;
  totalAmount?: number;
}