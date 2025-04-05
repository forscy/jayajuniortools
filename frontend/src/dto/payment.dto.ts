export enum PaymentMethod {
  BANK = 'BANK',
  E_WALLET = 'E_WALLET',
  CASH = 'CASH',
}

export interface PaymentDTO {
  id: number;
  amount: number;
  amountPaid: number;
  amountChange: number;

  paymentDate: Date;
  paymentStatus: string;
  
  createdAt: string;
  updatedAt: string;

  orderId: number;
  receiver: PaymentReceiverDTO;
}

export interface PaymentReceiverDTO {
  id: number;
  method: string;
  provider: string;
  accountNumber: string;
  accountHolderName: string;
}
