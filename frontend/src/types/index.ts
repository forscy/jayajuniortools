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

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  sku?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  // token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

// export interface RootState {
//   auth: AuthState;
//   product: ProductState;
// }

// Define types based on Prisma schema
export interface User {
  name: string;
  email: string;
  status: UserStatus;
  createdAt: string;
  role: Role;
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
  status: OrderStatus
  createdAt: string;
  totalAmount?: number;
}

export interface Review {
  id: number;
  productId: number;
  productName: string;
  rating: number;
  comment?: string;
  createdAt: string;
}

export interface WishlistItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  price: number;
}
