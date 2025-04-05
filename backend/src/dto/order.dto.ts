import { PaymentDTO } from "./payment.dto";
import { UserDTO } from "./user.dto";

export interface OrderDTO {
  id: number;
  status: string;
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
