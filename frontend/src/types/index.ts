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

export interface User {
  id: number;
  name: string;
  email: string;
  status: UserStatus;
  role: Role;
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
