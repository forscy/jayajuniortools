import { BASE_API_URL } from "../constants/url.constant";
import { BaseController } from "./BaseController";
import { ProductDTO, ProductFilters } from "../dto/product.dto";
import { CategoryDTO } from "../dto/category.dto";

// src/controllers/ProductController.ts

class ProductController extends BaseController {
  constructor() {
    super(`${BASE_API_URL}/products`);
  }

  // Get all products with optional pagination and filters
  public async getProducts(params?: {
    page?: number;
    pageSize?: number;
    search?: string;
    category?: number;
    minPrice?: number;
    maxPrice?: number;
    sort?: string;
  }) {
    return this.setAuthHeader().get<ProductDTO[]>("", params);
  }

  // Get all products with optional pagination and filters
  public async getAllProducts(params?: ProductFilters) {
    return this.setAuthHeader().get<ProductDTO[]>("/all", params);
  }

  // Get a specific product by ID
  public async getProductById(id: number) {
    return this.setAuthHeader().get<ProductDTO>(`/${id}`);
  }

  // Create a new product (requires admin/inventory manager role)
  public async createProduct(productData: ProductDTO) {
    return this.setAuthHeader().post<ProductDTO>("", productData);
  }

  // Update a product (requires admin/inventory manager role)
  public async updateProduct(id: number, productData: Partial<ProductDTO>) {
    return this.setAuthHeader().put<ProductDTO>(`/${id}`, productData);
  }

  // Delete a product (requires admin/inventory manager role)
  public async deleteProduct(id: number) {
    return this.setAuthHeader().delete<ProductDTO>(`/soft/${id}`);
  }

  // Get product categories
  public async getCategories() {
    return this.setAuthHeader().get<CategoryDTO[]>("/categories");
  }

  // Delete product image
  public async deleteProductImage(productId: number, imageId: number) {
    return this.setAuthHeader().delete<void>(`/${productId}/images/${imageId}`);
  }

  // Add product to user's wishlist
  public async addToWishlist(productId: number) {
    return this.setAuthHeader().post<void>(`/${productId}/wishlist`, {});
  }

  // Remove product from user's wishlist
  public async removeFromWishlist(productId: number) {
    return this.setAuthHeader().delete<void>(`/${productId}/wishlist`);
  }

  // Get product inventory
  public async getProductInventory(productId: number) {
    return this.setAuthHeader().get<any>(`/${productId}/inventory`);
  }

  // Update product inventory (requires inventory manager role)
  public async updateProductInventory(productId: number, inventoryData: any) {
    return this.setAuthHeader().put<any>(
      `/${productId}/inventory`,
      inventoryData
    );
  }
}

const productController = new ProductController();
export default productController;
