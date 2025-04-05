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

export interface UserDTO {
  id?: number | null;
  name: string;
  email?: string | null;
  password?: string | null;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  role: Role;
}

export interface UserCreateDTO {
  name: string;
  email?: string | null;
  password?: string | null;
  status: UserStatus;
  role: Role;
}