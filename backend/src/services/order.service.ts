import { OrderStatus } from "@prisma/client";
import { prisma } from "../config/client.config";
import { OrderDTO, OrderItemDTO } from "../dto/order.dto";
import { calculateUnitPrice } from "../utils/transaction.util"; // Pastikan fungsi ini sudah ada di utils

interface CreateOrderParams {
  userId: number;
  items: OrderItemDTO[];
  maker?: string;
  emailMaker?: string;
}

// Fungsi untuk membuat order baru
export const createOrder = async ({
  userId,
  items,
  maker,
  emailMaker,
}: CreateOrderParams): Promise<OrderDTO> => {
  try {
    // Validasi parameter
    if (!userId || !items || items.length === 0) {
      throw new Error("Invalid parameters");
    }

    // Menghitung totalAmount dan membuat item order sekaligus mengurangi stok produk dalam satu transaksi
    const totalAmount = await prisma.$transaction(async (prisma) => {
      let total = 0; // Total amount yang akan dikembalikan

      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          include: {
            discount: true, // Sertakan informasi diskon jika ada
          },
        });

        if (!product) throw new Error(`Product not found ${item.productId}`);

        // Pastikan stok cukup sebelum mengurangi
        if (product.quantityInStock < item.quantity) {
          throw new Error(
            `Stok ${product.name} tidak cukup, tersisa ${product.quantityInStock} stok. Anda baru saja memesan ${item.quantity}`
          );
        }

        // Kalkulasi harga unit setelah diskon
        const unitPrice = calculateUnitPrice(
          product.retailPrice,
          product.discount
            ? {
                discountValue: product.discount
                  ? product.discount.discountValue
                  : 0,
                discountType: product.discount
                  ? product.discount.discountType
                  : "PERCENTAGE",
              }
            : undefined
        );

        const totalPrice = unitPrice * item.quantity;
        item.unitPrice = unitPrice;
        item.totalPrice = totalPrice;

        // Update stok produk setelah pengurangan
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantityInStock: product.quantityInStock - item.quantity,
          },
        });

        // Menambahkan harga total untuk item ke totalAmount
        total += totalPrice;
      }

      return total;
    });

    // Membuat order
    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        maker,
        emailMaker,
        status: "PENDING",
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.totalPrice,
          })),
        },
      },
      include: {
        user: true,
        items: true,
      },
    });

    return mapOrderToDTO(order);
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || "Failed to create order");
  }
};

// Get order by ID
export const getOrderById = async (
  orderId: number
): Promise<OrderDTO | null> => {
  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: true,
        items: true,
      },
    });

    if (!order) {
      return null;
    }

    return mapOrderToDTO(order);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch order");
  }
};

// Get all orders with pagination
interface GetOrdersParams {
  page: number; // Halaman yang ingin diambil
  limit: number; // Jumlah pesanan per halaman
}

export const getOrders = async ({
  page = 1,
  limit = 10,
}: GetOrdersParams): Promise<OrderDTO[]> => {
  try {
    const orders = await prisma.order.findMany({
      skip: (page - 1) * limit,
      take: limit,
      include: {
        user: true,
        items: true,
      },
    });

    return orders.map(mapOrderToDTO);
  } catch (error) {
    console.error(error);
    throw new Error("Failed to fetch orders");
  }
};

// Cancel Order by Id and update stock for each item in the order
export const cancelOrderById = async (orderId: number) => {
  try {
    if (!orderId) throw new Error("Order id tidak boleh kosong");
    // Ambil order berdasarkan orderId
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        items: true, // Ambil semua item yang terkait dengan order
      },
    });

    if (!order) throw new Error(`Order with ID ${orderId} not found`);

    // Update status order menjadi CANCELLED
    const orderUpdated = await prisma.order.update({
      where: {
        id: orderId,
      },
      data: {
        status: OrderStatus.CANCELLED,
      },
      include: {
        user: true,
        items: true,
      },
    });

    // Kembalikan stok produk untuk setiap item yang ada dalam order
    const updateStockPromises = order.items.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId },
      });

      if (!product)
        throw new Error(`Product not found with ID ${item.productId}`);

      // Mengembalikan stok produk
      await prisma.product.update({
        where: { id: item.productId },
        data: {
          quantityInStock: product.quantityInStock + item.quantity,
        },
      });
    });

    // Tunggu semua pembaruan stok selesai
    await Promise.all(updateStockPromises);

    // Kembalikan DTO setelah pembaruan
    return mapOrderToDTO(orderUpdated);
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || "Gagal melakukan pembatalan order");
  }
};

// Fungsi untuk mapping order ke DTO
const mapOrderToDTO = (order: any): OrderDTO => {
  return {
    id: order.id,
    status: order.status,
    totalAmount: order.totalAmount,
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
    user: {
      name: order.user.name,
      email: order.user.email,
      status: order.user.status,
      role: order.user.role,
      createdAt: order.user.createdAt,
      updatedAt: order.user.updatedAt,
    },
    items: order.items.map((item: any) => ({
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      totalPrice: item.totalPrice,
    })),
  };
};
