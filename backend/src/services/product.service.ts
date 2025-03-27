import {
  Category,
  ProductCategory,
  ProductImage,
  Review,
} from "@prisma/client";
import { prisma } from "../config/client.config";
import { ProductDTO } from "../dto/ProductDTO";
import { Pagination } from "../utils/responseWrapper";

// Create a new product
export const createProduct = async (productData: ProductDTO) => {
  const {
    name,
    description,
    retailPrice,
    wholesalePrice,
    minWholesaleQty,
    sku,

    // inventory
    quantityInStock,
    minimumStock,
    locationName,

    // relation
    categories,
    imageUrls,
    discount,
    brand,
  } = productData;

  try {
    const product = await prisma.$transaction(async (tx) => {
      const productExist = await tx.product.findFirst({
        where: {
          name,
        },
      });

      if (productExist) {
        throw new Error("Product already exist");
      }

      var categoriesData: Category[] = [];
      // Add categories
      if (categories && categories.length > 0) {
        categoriesData = await tx.category.findMany({
          where: {
            name: {
              in: categories,
            },
          },
        });
      }

      // Add Product
      const product = await tx.product.create({
        data: {
          name,
          description,
          retailPrice,
          wholesalePrice,
          minWholesaleQty,
          sku,
          quantityInStock,
          minimumStock,
          locationName,
          categories: {
            create: categoriesData.map((category) => ({
              category: {
                connect: {
                  id: category.id,
                },
              },
            })),
          },
          discount: discount
            ? {
                connectOrCreate: {
                  where: {
                    name: discount.name, // Menghubungkan berdasarkan nama discount
                  },
                  create: {
                    name: discount.name,
                    description: discount.description,
                    discountType: discount.discountType,
                    discountValue: discount.discountValue,
                    minPurchase: discount.minPurchase,
                    startDate: discount.startDate,
                    endDate: discount.endDate,
                    isActive: discount.isActive,
                  },
                },
              }
            : undefined,
          brand: brand
            ? {
                connectOrCreate: {
                  where: {
                    name: brand.name, // Menghubungkan berdasarkan nama brand
                  },
                  create: {
                    name: brand.name,
                    description: brand.description,
                    logoUrl: brand.logoUrl,
                  },
                },
              }
            : undefined,
        },
      });

      if (imageUrls && imageUrls.length > 0) {
        // Add multiple product images
        await tx.productImage.createMany({
          data: imageUrls.map((url) => ({
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
              category: true,
            },
          },
          imageUrls: true,
          discount: true,
          brand: true,
        },
      });
    });

    if (product) {
      const newProduct: ProductDTO = {
        id: product.id,
        name: product.name,
        description: product.description!,
        retailPrice: product.retailPrice!,
        wholesalePrice: product.wholesalePrice!,
        minWholesaleQty: product.minWholesaleQty!,
        sku: product.sku!,
        quantityInStock: product.quantityInStock!,
        minimumStock: product.minimumStock!,
        locationName: product.locationName!,
        categories: product.categories.map((c) => c.category.name)!,
        imageUrls: product.imageUrls.map((i) => i.url)!,
        discount: {
          name: product.discount?.name!,
          description: product.discount?.description!,
          discountType: product.discount?.discountType!,
          discountValue: product.discount?.discountValue!,
          minPurchase: product.discount?.minPurchase!,
          startDate: product.discount?.startDate!,
          endDate: product.discount?.endDate!,
          isActive: product.discount?.isActive!,
        },
        brand: {
          name: product.brand?.name!,
          description: product.brand?.description!,
          logoUrl: product.brand?.logoUrl!,
        },
      };
      return newProduct;
    }
    return null;
  } catch (error: any) {
    console.error(error);
    throw new Error(error.message || "Failed to create product");
  }
};

// Get all products with pagination
export const getProducts = async (page = 1, limit = 10) => {
  try {
    const skip = (page - 1) * limit;

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        skip,
        take: limit,
        include: {
          categories: {
            include: {
              category: true,
            },
          },
          imageUrls: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      prisma.product.count(),
    ]);

    const pagination: Pagination = {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };

    // Convert product data to DTO
    const productsDTO = products.map((product) => {
      const newProduct: ProductDTO = {
        id: product.id,
        name: product.name,
        description: product.description!,
        retailPrice: product.retailPrice!,
        wholesalePrice: product.wholesalePrice!,
        minWholesaleQty: product.minWholesaleQty!,
        sku: product.sku!,
        quantityInStock: product.quantityInStock!,
        minimumStock: product.minimumStock!,
        locationName: product.locationName!,
        categories: product.categories.map((c) => c.category.name)!,
        imageUrls: product.imageUrls.map((i) => i.url)!,
      };

      return newProduct;
    });

    return {
      products: productsDTO,
      pagination: pagination,
    };
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
        categories: {
          include: {
            category: true,
          },
        },
        imageUrls: true,
        discount: true,
        brand: true,
        reviews: true,
      },
    });

    if (product) {
      const newProduct: ProductDTO = {
        id: product.id,
        name: product.name,
        description: product.description!,
        retailPrice: product.retailPrice!,
        wholesalePrice: product.wholesalePrice!,
        minWholesaleQty: product.minWholesaleQty!,
        sku: product.sku!,
        quantityInStock: product.quantityInStock!,
        minimumStock: product.minimumStock!,
        locationName: product.locationName!,
        categories: product.categories.map((c) => c.category.name)!,
        imageUrls: product.imageUrls.map((i) => i.url)!,
        discount: {
          name: product.discount?.name!,
          description: product.discount?.description!,
          discountType: product.discount?.discountType!,
          discountValue: product.discount?.discountValue!,
          minPurchase: product.discount?.minPurchase!,
          startDate: product.discount?.startDate!,
          endDate: product.discount?.endDate!,
          isActive: product.discount?.isActive!,
        },
        brand: {
          name: product.brand?.name!,
          description: product.brand?.description!,
          logoUrl: product.brand?.logoUrl!,
        },
      };

      return newProduct;
    }

    return null;
  } catch (error: any) {
    throw new Error(error.message || "Failed to retrieve product");
  }
};
