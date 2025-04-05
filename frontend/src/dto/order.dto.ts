import { PaymentDTO } from "./payment.dto";
import { UserDTO } from "./user.dto";

export enum OrderStatus {
  PENDING = "PENDING", // Order baru dibuat, menunggu pembayaran
  COMPLETED = "COMPLETED", // Order selesai, dibayar dan siap diambil
  CANCELLED = "CANCELLED", // Order dibatalkan
  FAILED = "FAILED", // Pembayaran gagal atau order gagal diproses
  PACKAGING = "PACKAGING", // Pesanan sedang dikemas
  READY_FOR_PICKUP = "READY_FOR_PICKUP", // Pesanan siap untuk diambil
}

export interface OrderDTO {
  id: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  maker?: string | null;
  emailMaker?: string | null;
  user: UserDTO;
  items: OrderItemDTO[];
  payment?: PaymentDTO;
}

export interface OrderItemDTO {
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  productId: number;
}

export interface OrderCreateDTO {
  userId?: number;
  items: {
    productId: number;
    quantity: number;
  }[];
  maker?: string;
  emailMaker?: string;
}
