import { BASE_API_URL } from "../types/constants";
import { BaseController } from "./BaseController";
import { Product, ProductImage, Category } from "../types";
import { ProductDTO } from "../dto/ProductDTO";

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

  // Get a specific product by ID
  public async getProductById(id: number) {
    return this.setAuthHeader().get<ProductDTO>(`/${id}`);
  }

  // Create a new product (requires admin/inventory manager role)
  public async createProduct(productData: ProductDTO) {
    return this.setAuthHeader().post<ProductDTO>("", productData);
  }

  // Update a product (requires admin/inventory manager role)
  public async updateProduct(id: number, productData: Partial<Product>) {
    return this.setAuthHeader().put<Product>(`/${id}`, productData);
  }

  // Delete a product (requires admin/inventory manager role)
  public async deleteProduct(id: number) {
    return this.setAuthHeader().delete<ProductDTO>(`/${id}`);
  }

  // Get product categories
  public async getCategories() {
    return this.setAuthHeader().get<Category[]>("/categories");
  }

  // Add product image
  public async addProductImage(productId: number, imageData: FormData) {
    return this.setAuthHeader().post<ProductImage>(`/${productId}/images`, imageData);
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
    return this.setAuthHeader().put<any>(`/${productId}/inventory`, inventoryData);
  }
}

const productController = new ProductController();
export default productController;