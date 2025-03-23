import { prisma } from "../config/client.config";

export interface CreateProductInput {
  name: string;
  description?: string;
  retailPrice: number;
  wholesalePrice?: number;
  minWholesaleQty?: number;
  sku?: string;
  categories?: number[];
  images?: string[];
  quantityInStock: number;
  minimumStock?: number;
}

export interface UpdateProductInput {
  name?: string;
  description?: string;
  retailPrice?: number;
  wholesalePrice?: number;
  minWholesaleQty?: number;
  sku?: string;
  categories?: number[];
  images?: string[];
  quantityInStock?: number;
  minimumStock?: number;
}

export interface ProductSearchParams {
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  categoryId?: number;
  inStock?: boolean;
}

// Create a new product
export const createProduct = async (data: CreateProductInput) => {
  const {
    categories = [],
    images = [],
    quantityInStock,
    minimumStock = 5,
    ...productData
  } = data;

  return prisma.$transaction(async (tx) => {
    // Create inventory first
    const inventory = await tx.inventory.create({
      data: {
        quantityInStock,
        minimumStock,
      },
    });

    // Create the product
    const product = await tx.product.create({
      data: {
        ...productData,
        inventoryId: inventory.id,
      },
    });

    // Add categories
    if (categories.length > 0) {
      await tx.productCategory.createMany({
        data: categories.map((categoryId) => ({
          productId: product.id,
          categoryId,
        })),
      });
    }

    // Add images
    if (images.length > 0) {
      await tx.productImage.createMany({
        data: images.map((url) => ({
          productId: product.id,
          url,
        })),
      });
    }

    return tx.product.findUnique({
      where: { id: product.id },
      include: {
        categories: {
          include: {
            Category: true,
          },
        },
        images: true,
        inventory: true,
      },
    });
  });
};

// Get all products with pagination
export const getProducts = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      skip,
      take: limit,
      include: {
        categories: {
          include: {
            Category: true,
          },
        },
        images: true,
        inventory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.product.count(),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get a product by ID
export const getProductById = async (id: number) => {
  return prisma.product.findUnique({
    where: { id },
    include: {
      categories: {
        include: {
          Category: true,
        },
      },
      images: true,
      inventory: true,
      discounts: true,
      reviews: true,
    },
  });
};

// Update a product
export const updateProduct = async (id: number, data: UpdateProductInput) => {
  const { categories, images, quantityInStock, minimumStock, ...updateData } =
    data;

  return prisma.$transaction(async (tx) => {
    const product = await tx.product.findUnique({
      where: { id },
      include: {
        categories: true,
        images: true,
        inventory: true,
      },
    });

    if (!product) {
      throw new Error("Product not found");
    }

    // Update inventory if stock info is provided
    if (quantityInStock !== undefined || minimumStock !== undefined) {
      await tx.inventory.update({
        where: { id: product.inventoryId },
        data: {
          ...(quantityInStock !== undefined ? { quantityInStock } : {}),
          ...(minimumStock !== undefined ? { minimumStock } : {}),
        },
      });
    }

    // Update the product
    const updatedProduct = await tx.product.update({
      where: { id },
      data: updateData,
    });

    // Update categories if provided
    if (categories) {
      // Delete existing categories
      await tx.productCategory.deleteMany({
        where: { productId: id },
      });

      // Add new categories
      await tx.productCategory.createMany({
        data: categories.map((categoryId) => ({
          productId: id,
          categoryId,
        })),
      });
    }

    // Update images if provided
    if (images) {
      // Delete existing images
      await tx.productImage.deleteMany({
        where: { productId: id },
      });

      // Add new images
      await tx.productImage.createMany({
        data: images.map((url) => ({
          productId: id,
          url,
        })),
      });
    }

    return tx.product.findUnique({
      where: { id },
      include: {
        categories: {
          include: {
            Category: true,
          },
        },
        images: true,
        inventory: true,
      },
    });
  });
};

// Delete a product
export const deleteProduct = async (id: number) => {
  return prisma.$transaction(async (tx) => {
    // Get product to get inventory ID
    const product = await tx.product.findUnique({
      where: { id },
      select: { inventoryId: true },
    });

    if (!product) throw new Error("Product not found");

    // Delete product
    await tx.product.delete({ where: { id } });

    // Delete inventory
    await tx.inventory.delete({ where: { id: product.inventoryId } });

    return { id };
  });
};

// Search products
export const searchProducts = async (
  params: ProductSearchParams,
  page = 1,
  limit = 10
) => {
  const { name, minPrice, maxPrice, categoryId, inStock } = params;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (name) {
    whereClause.name = {
      contains: name,
    };
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    whereClause.retailPrice = {};
    if (minPrice !== undefined) {
      whereClause.retailPrice.gte = minPrice;
    }
    if (maxPrice !== undefined) {
      whereClause.retailPrice.lte = maxPrice;
    }
  }

  if (categoryId) {
    whereClause.categories = {
      some: {
        categoryId,
      },
    };
  }

  if (inStock) {
    whereClause.inventory = {
      quantityInStock: {
        gt: 0,
      },
    };
  }

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        categories: {
          include: {
            Category: true,
          },
        },
        images: true,
        inventory: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    prisma.product.count({
      where: whereClause,
    }),
  ]);

  return {
    products,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};
