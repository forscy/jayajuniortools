import { ProductStatus } from "@prisma/client";
import { prisma } from "../config/client.config";
import { ProductDTO } from "../dto/product.dto";
import { Pagination } from "../utils/responseWrapper";

// Helper function to handle category creation and linking
const handleCategories = async (tx: any, categories: string[]) => {
  const categoriesData = await tx.category.findMany({
    where: {
      name: {
        in: categories,
      },
    },
  });
  return categoriesData;
};

// Helper function to handle discount and brand creation
const handleDiscountAndBrand = async (tx: any, discount: any, brand: any) => {
  const discountData = discount
    ? {
        connectOrCreate: {
          where: { name: discount.name },
          create: discount,
        },
      }
    : undefined;

  const brandData = brand
    ? {
        connectOrCreate: {
          where: { name: brand.name },
          create: brand,
        },
      }
    : undefined;

  return { discountData, brandData };
};

// Create or Update a product
export const createOrUpdateProduct = async (
  productData: ProductDTO,
  id?: number
) => {
  const {
    name,
    productStatus,
    description,
    retailPrice,
    wholesalePrice,
    minWholesaleQty,
    sku,
    quantityInStock,
    minimumStock,
    locationName,
    categories,
    imageUrls,
    discount,
    brand,
  } = productData;

  try {
    const product = await prisma.$transaction(async (tx) => {
      if (id) {
        // Update existing product
        const existingProduct = await tx.product.findUnique({
          where: { id },
          include: {
            categories: { include: { category: true } },
            imageUrls: true,
          },
        });

        if (!existingProduct) throw new Error("Product not found");

        // Handle categories update
        const categoriesData =
          categories && categories.length > 0
            ? await handleCategories(tx, categories)
            : [];

        // Handle discount and brand update
        const { discountData, brandData } = await handleDiscountAndBrand(
          tx,
          discount,
          brand
        );

        // Update the product
        await tx.product.update({
          where: { id },
          data: {
            name,
            productStatus,
            description,
            retailPrice,
            wholesalePrice,
            minWholesaleQty,
            sku,
            quantityInStock,
            minimumStock,
            locationName,
            discount: discountData,
            brand: brandData,
          },
        });

        // Update categories
        if (categoriesData.length > 0) {
          await tx.productCategory.deleteMany({ where: { productId: id } });
          await tx.productCategory.createMany({
            data: categoriesData.map((category: any) => ({
              productId: id,
              categoryName: category.name,
            })),
          });
        }

        // Update images
        if (imageUrls) {
          await tx.productImage.deleteMany({ where: { productId: id } });
          await tx.productImage.createMany({
            data: imageUrls.map((url) => ({ productId: id, url })),
          });
        }

        return await tx.product.findUnique({
          where: { id },
          include: {
            categories: { include: { category: true } },
            imageUrls: true,
            discount: true,
            brand: true,
          },
        });
      } else {
        // Create new product
        const productExist = await tx.product.findFirst({ where: { name } });

        if (productExist) throw new Error("Product already exists");

        const categoriesData =
          categories && categories.length > 0
            ? await handleCategories(tx, categories)
            : [];

        const { discountData, brandData } = await handleDiscountAndBrand(
          tx,
          discount,
          brand
        );

        const newProduct = await tx.product.create({
          data: {
            name,
            productStatus,
            description,
            retailPrice,
            wholesalePrice,
            minWholesaleQty,
            sku,
            quantityInStock,
            minimumStock,
            locationName,
            categories: {
              create: categoriesData.map((category: any) => ({
                category: { connect: { id: category.id } },
              })),
            },
            discount: discountData,
            brand: brandData,
          },
        });

        if (imageUrls && imageUrls.length > 0) {
          await tx.productImage.createMany({
            data: imageUrls.map((url) => ({ productId: newProduct.id, url })),
          });
        }

        return await tx.product.findUnique({
          where: { id: newProduct.id },
          include: {
            categories: { include: { category: true } },
            imageUrls: true,
            discount: true,
            brand: true,
          },
        });
      }
    });

    return product ? mapProductToDTO(product) : null;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || "Failed to create or update product");
  }
};

// Helper function to map product to DTO
const mapProductToDTO = (product: any): ProductDTO => {
  return {
    id: product.id,
    name: product.name,
    description: product.description || undefined,
    retailPrice: product.retailPrice,
    wholesalePrice: product.wholesalePrice || undefined,
    minWholesaleQty: product.minWholesaleQty || undefined,
    sku: product.sku || undefined,
    quantityInStock: product.quantityInStock,
    minimumStock: product.minimumStock || undefined,
    locationName: product.locationName || undefined,
    productStatus: product.productStatus || undefined,

    categories: product.categories
      ? product.categories.map((c: any) => c.category.name)
      : undefined,
    imageUrls: product.imageUrls
      ? product.imageUrls.map((i: any) => i.url)
      : undefined,
    discount: product.discount
      ? {
          name: product.discount.name,
          description: product.discount.description || undefined,
          discountType: product.discount.discountType,
          discountValue: product.discount.discountValue,
          minPurchase: product.discount.minPurchase || undefined,
          startDate: product.discount.startDate,
          endDate: product.discount.endDate,
          isActive: product.discount.isActive || undefined,
        }
      : undefined,
    brand: product.brand
      ? {
          name: product.brand.name,
          description: product.brand.description,
          logoUrl: product.brand.logoUrl,
        }
      : undefined,
  };
};

export const getProducts = async (
  page = 1,
  limit = 10,
  productStatus?: ProductStatus[] // Status produk yang diinginkan
) => {
  try {
    const skip = (page - 1) * limit;

    // Create where clause with the condition if productStatus is provided
    const whereClause =
      productStatus && productStatus.length > 0
        ? { productStatus: { in: productStatus } } // Filter produk berdasarkan status
        : {}; // Jika tidak ada status, maka tidak ada filter status

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        where: whereClause, // Gunakan whereClause untuk memfilter produk berdasarkan status
        include: {
          categories: { include: { category: true } },
          imageUrls: true,
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.product.count({
        where: whereClause, // Hitung produk dengan filter status yang sama
      }),
    ]);

    const pagination: Pagination = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };

    // Map produk ke DTO
    const productsDTO = products.map(mapProductToDTO);

    return { products: productsDTO, pagination };
  } catch (error: any) {
    throw new Error(error.message || "Failed to retrieve products");
  }
};

// Get a product by ID
export const getProductById = async (id: number) => {
  try {
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        categories: { include: { category: true } },
        imageUrls: true,
        discount: true,
        brand: true,
        reviews: true,
      },
    });

    return product ? mapProductToDTO(product) : null;
  } catch (error: any) {
    throw new Error(error.message || "Failed to retrieve product");
  }
};

// Delete by ID
// Delete a product by ID
export const hardDeleteProductById = async (id: number) => {
  try {
    await prisma.$transaction(async (tx) => {
      // First, delete related records
      await tx.productCategory.deleteMany({ where: { productId: id } });
      await tx.productImage.deleteMany({ where: { productId: id } });
      await tx.review.deleteMany({ where: { productId: id } });

      // Then delete the product itself
      await tx.product.delete({ where: { id } });
    });

    return true;
  } catch (error: any) {
    console.error("Error deleting product:", error);
    throw new Error(error.message || "Failed to delete product");
  }
};

// DELETE BUT BY CHANGE STATUS TO DELETED
export const softDeleteProductById = async (id: number) => {
  try {
    // Check if the product exists first
    const productExists = await prisma.product.findUnique({
      where: { id },
    });

    if (!productExists) {
      throw new Error("Product not found");
    }

    // Proceed to update the product (soft delete by changing status)
    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        productStatus: "DELETED", // Mark the product as deleted
      },
    });

    return mapProductToDTO(updatedProduct);
  } catch (error: any) {
    console.error("Error soft deleting product:", error);
    throw new Error(error.message || "Failed to soft delete product");
  }
};
