import { BaseController, ApiResponse } from "./BaseController";
import { BASE_API_URL } from "../constants/url.constant";
import { CategoryDTO } from "../dto/category.dto";

class CategoryController extends BaseController {
  constructor() {
    super(`${BASE_API_URL}/categories`);
  }

  /**
   * Get all categories with optional pagination
   * @param page Page number (defaults to 1)
   * @param limit Number of items per page (defaults to 10)
   * @returns Promise with categories data and pagination info
   */
  async getCategories(): Promise<ApiResponse<CategoryDTO[]>> {
    return await this.get<CategoryDTO[]>("");
  }

  /**
   * Get a specific category by ID
   * @param id Category ID
   * @returns Promise with category data
   */
  async getCategoryById(id: number): Promise<ApiResponse<CategoryDTO>> {
    return await this.get<CategoryDTO>(`/${id}`);
  }

  /**
   * Create a new category (requires authentication)
   * @param categoryData Category data to create
   * @returns Promise with created category data
   */
  async createCategory(
    categoryData: CategoryDTO
  ): Promise<ApiResponse<CategoryDTO>> {
    this.setAuthHeader(); // Set authentication header
    return await this.post<CategoryDTO>("", categoryData);
  }

  /**
   * Update an existing category (requires authentication)
   * @param id Category ID to update
   * @param categoryData Category data to update
   * @returns Promise with updated category data
   */
  async updateCategory(
    id: number,
    categoryData: CategoryDTO
  ): Promise<ApiResponse<CategoryDTO>> {
    this.setAuthHeader(); // Set authentication header
    return await this.put<CategoryDTO>(`/${id}`, categoryData);
  }

  /**
   * Delete a category (requires authentication)
   * @param id Category ID to delete
   * @returns Promise with deletion result
   */
  async deleteCategory(name: string): Promise<ApiResponse<any>> {
    this.setAuthHeader(); // Set authentication header
    return await this.delete<any>(`/${name}`);
  }

  /**
   * Search categories by name
   * @param searchTerm Search term to filter categories
   * @param page Page number (defaults to 1)
   * @param limit Number of items per page (defaults to 10)
   * @returns Promise with filtered categories data
   */
  async searchCategories(
    searchTerm: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ApiResponse<CategoryDTO[]>> {
    return await this.get<CategoryDTO[]>("/search", {
      name: searchTerm,
      page,
      limit,
    });
  }
}

// Create and export a singleton instance
const categoryController = new CategoryController();
export default categoryController;
