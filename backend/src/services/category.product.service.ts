import { prisma } from "../config/client.config";

export interface CreateCategoryInput {
  name: string;
}

export interface UpdateCategoryInput {
  name?: string;
}

export interface CategorySearchParams {
  name?: string;
}

// Create a new category
export const createCategory = async (data: CreateCategoryInput) => {
  return prisma.category.create({
    data,
  });
};

// Get all categories with pagination
export const getCategories = async (page = 1, limit = 10) => {
  const skip = (page - 1) * limit;

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      skip,
      take: limit,
      orderBy: {
        name: "asc",
      },
      include: {
        products: {
          include: {
            Product: true,
          },
        },
      },
    }),
    prisma.category.count(),
  ]);

  return {
    categories,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};

// Get a category by ID
export const getCategoryById = async (id: number) => {
  return prisma.category.findUnique({
    where: { id },
    include: {
      products: {
        include: {
          Product: true,
        },
      },
    },
  });
};

// Update a category
export const updateCategory = async (id: number, data: UpdateCategoryInput) => {
  return prisma.category.update({
    where: { id },
    data,
  });
};

// Delete a category
export const deleteCategory = async (id: number) => {
  return prisma.$transaction(async (tx) => {
    // First delete all product associations with this category
    await tx.productCategory.deleteMany({
      where: { categoryId: id },
    });

    // Then delete the category
    return tx.category.delete({
      where: { id },
    });
  });
};

// Search categories
export const searchCategories = async (
  params: CategorySearchParams,
  page = 1,
  limit = 10
) => {
  const { name } = params;
  const skip = (page - 1) * limit;

  const whereClause: any = {};

  if (name) {
    whereClause.name = {
      contains: name,
      mode: "insensitive",
    };
  }

  const [categories, total] = await Promise.all([
    prisma.category.findMany({
      where: whereClause,
      skip,
      take: limit,
      include: {
        products: {
          include: {
            Product: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    }),
    prisma.category.count({
      where: whereClause,
    }),
  ]);

  return {
    categories,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  };
};
