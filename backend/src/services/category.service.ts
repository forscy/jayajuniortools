import { prisma } from "../config/client.config";
import { CategoryDTO } from "../dto/category.dto";
// Create a new category
export const createCategory = async (categoryData: CategoryDTO) => {
  try {
    const newCategory = await prisma.category.create({
      data: {...categoryData, id: undefined},
    });

    const newCategoryDTO: CategoryDTO = {
      id: newCategory.id,
      name: newCategory.name,
      description: newCategory.description,
    };

    return newCategoryDTO;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while creating the category"
    );
  }
};

// Get all categories with pagination
export const getCategories = async () => {
  try {
    const categories = await prisma.category.findMany({
      orderBy: {
        name: "asc",
      },
    });

    const categoriesDTO = categories.map((category) => {
      const categoryDTO: CategoryDTO = {
        id: category.id,
        name: category.name,
        description: category.description,
      };

      return categoryDTO;
    });

    return categoriesDTO;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while retrieving categories"
    );
  }
};

// Update a category
export const updateCategory = async (id: number, data: CategoryDTO) => {
  try {
    const newCategory = await prisma.category.update({
      where: { id },
      data: {...data, id:undefined},
    });

    const newCategoryDTO: CategoryDTO = {
      id: newCategory.id,
      name: newCategory.name,
      description: newCategory.description,
    };

    return newCategoryDTO;
  } catch (error: any) {
    throw new Error(
      error.message || "An error occurred while updating the category"
    );
  }
};
