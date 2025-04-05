import { PaymentMethod, PaymentStatus } from "@prisma/client";
import { prisma } from "../config/client.config";
import { PaymentDTO } from "../dto/payment.dto";
import { amountChange } from "../utils/transaction.util";

interface CreatePaymentParams {
  orderId: number;
  receiverId: number;
}

// Fungsi untuk membuat payment baru
export const createPayment = async ({
  orderId,
  receiverId,
}: CreatePaymentParams): Promise<PaymentDTO> => {
  try {
    // check param is valid
    if (!orderId || !receiverId) {
      throw new Error("Invalid parameters");
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    // check payment is already exist
    const existingPayment = await prisma.payment.findFirst({
      where: { orderId },
    });

    if (existingPayment) {
      throw new Error("Payment already exists for this order");
    }

    const payment = await prisma.payment.create({
      data: {
        amount: order.totalAmount,
        amountPaid: 0,
        amountChange: 0,
        paymentStatus: PaymentStatus.PENDING,
        orderId,
        receiverId,
      },
      include: {
        order: {
          select: {
            user: true, // Mengambil informasi user dari order
          },
        },
        receiver: true, // Mengambil informasi penerima pembayaran
      },
    });

    return mapPaymentToDTO(payment);
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || "Failed to create payment");
  }
};

// Pay the payment
export const payPayment = async (
  paymentId: number,
  amountPaid: number
): Promise<PaymentDTO> => {
  try {
    // check param is valid
    if (!paymentId || !amountPaid) {
      throw new Error("Invalid parameters");
    }
    if (amountPaid <= 0) {
      throw new Error("Amount paid must be greater than 0");
    }
    // check payment is already exist
    const existingPayment = await prisma.payment.findUnique({
      where: { id: paymentId },
    });
    if (!existingPayment) {
      throw new Error("Payment not found");
    }
    if (existingPayment.paymentStatus !== PaymentStatus.PENDING) {
      throw new Error("Payment is not pending");
    }
    if (amountPaid < existingPayment.amount) {
      throw new Error("Amount paid is less than total amount");
    }
    if (existingPayment.amountPaid > 0) {
      throw new Error("Payment has already been paid");
    }

    const payment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        amountPaid,
        amountChange: amountChange(amountPaid, existingPayment.amount),
        paymentStatus: PaymentStatus.COMPLETED,
      },
      include: {
        order: true,
        receiver: true,
      },
    });

    return mapPaymentToDTO(payment);
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || "Failed to pay payment");
  }
};

// Get payment by ID
export const getPaymentById = async (
  paymentId: number
): Promise<PaymentDTO | null> => {
  try {
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        order: true,
        receiver: true,
      },
    });

    if (!payment) {
      return null;
    }

    return mapPaymentToDTO(payment);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch payment");
  }
};

// Change receiver (include payment method)
interface ChangePaymentReceiverParams {
  paymentId: number;
  receiverId: number;
}
export const changePaymentReceiver = async ({
  paymentId,
  receiverId,
}: ChangePaymentReceiverParams) => {
  try {
    // cek param nya ada gak
    if (!paymentId || !receiverId) {
      throw new Error("Parameter tidak valid");
    }

    // Cek receiver ada gak
    const paymentReceiverExisting = await prisma.paymentReceiver.findUnique({
      where: {
        id: receiverId,
      },
    });

    if (!paymentReceiverExisting) {
      throw new Error("Data penerima pembayaran tidak tersedia");
    }

    const newPayment = await prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        receiverId: receiverId,
      },
    });

    return newPayment;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || "Gagal mengubah penerima pembayaran");
  }
};

// Fungsi untuk mapping payment ke DTO
const mapPaymentToDTO = (payment: any): PaymentDTO => {
  return {
    id: payment.id,
    amount: payment.amount,
    amountPaid: payment.amountPaid,
    amountChange: payment.amountChange,

    paymentDate: payment.paymentDate
      ? payment.paymentDate.toISOString()
      : undefined,
    paymentStatus: payment.paymentStatus,

    createdAt: payment.createdAt.toISOString(),
    updatedAt: payment.updatedAt.toISOString(),
    orderId: payment.orderId,
    receiver: mapReceiverToDTO(payment.receiver),
  };
};

// Fungsi untuk mapping receiver ke DTO
const mapReceiverToDTO = (receiver: any) => {
  return {
    id: receiver.id,
    method: receiver.method,
    provider: receiver.provider,
    accountNumber: receiver.accountNumber,
    accountHolderName: receiver.accountHolderName,
  };
};
