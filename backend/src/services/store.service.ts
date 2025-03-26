// src/services/store.service.ts

import { prisma } from "../config/client.config";

// read store information
export const getStoreService = async () => {
  try {
    const store = await prisma.store.findFirst();

    // merge with operational hours
    const operationalHours = await prisma.operationalHour.findMany({
      where: {
        storeId: store?.id,
      },
    });

    return {
      ...store,
      operationalHours,
    };
  } catch (error: any) {
    throw new Error(error.message || "Error getting store information");
  }
};

// get hours of operation
export const getOperationalHoursService = async () => {
  try {
    const operationalHours = await prisma.operationalHour.findMany();
    return operationalHours;
  } catch (error: any) {
    throw new Error(error.message || "Error getting operational hours");
  }
};

interface UpdateStoreData {
  storeId: number;
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
}

export const updateStoreService = async ({
  storeId,
  name,
  address,
  phone,
  email,
  description,
}: UpdateStoreData) => {
  try {
    if (!storeId) {
      throw new Error("Store ID is required");
    }
    // Cek apakah toko dengan storeId ada
    const store = await prisma.store.findUnique({
      where: { id: storeId },
    });

    if (!store) {
      throw new Error("Store not found");
    }

    // Update informasi toko
    const updatedStore = await prisma.store.update({
      where: { id: storeId },
      data: {
        name: name ?? store.name,
        address: address ?? store.address,
        phone: phone ?? store.phone,
        email: email ?? store.email,
        description: description ?? store.description,
      },
    });

    // merge with operational hours
    const operationalHours = await prisma.operationalHour.findMany({
      where: {
        storeId: storeId,
      },
    });

    return {
      message: "Store information updated successfully",
      store: {
        ...updatedStore,
        operationalHours,
      },
    };
  } catch (error: any) {
    throw new Error(error.message || "Error updating store information");
  }
};
