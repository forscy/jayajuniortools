// src/redux/slices/productSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { ProductState } from "../state/ProductState";
import productController from "../../controllers/ProductController";
import { ProductDTO, ProductFilters } from "../../dto/product.dto";
import { ApiResponse } from "../../controllers/BaseController";

// Initial state
const initialState: ProductState = {
  products: [],
  product: null,
  currentProduct: null,
  loading: false,
  error: null,
};

// Then update your thunk
export const addProduct = createAsyncThunk(
  "product/addProduct",
  async (productData: ProductDTO, { getState, rejectWithValue }) => {
    try {
      const response = await productController.createProduct(productData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add product"
      );
    }
  }
);

// Get product by ID
export const fetchProductById = createAsyncThunk(
  "product/fetchProductById",
  async (productId: number, { rejectWithValue }) => {
    try {
      const response = await productController.getProductById(productId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch product"
      );
    }
  }
);

// Async thunk for fetching products
export const fetchProducts = createAsyncThunk(
  "product/fetchProducts",
  async (
    params: {
      page?: number;
      pageSize?: number;
      search?: string;
      category?: number;
      minPrice?: number;
      maxPrice?: number;
      sort?: string;
    } = {},
    { rejectWithValue }
  ) => {
    try {
      const response = await productController.getProducts(params || {});
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Async thunk for fetching products
export const fetchAllProducts = createAsyncThunk(
  "product/fetchAllProducts",
  async (
    params: ProductFilters,
    { rejectWithValue }
  ) => {
    try {
      const response = await productController.getAllProducts(params || {});
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (
    { id, productData }: { id: number; productData: Partial<ProductDTO> },
    { getState, rejectWithValue }
  ) => {
    try {
      const response = await productController.updateProduct(id, productData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// Async thunk for deleting a product
export const deleteProduct = createAsyncThunk(
  "product/deleteProduct",
  async (productId: number, { getState, rejectWithValue }) => {
    try {
      await productController.deleteProduct(productId);
      return productId;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// Product slice
const productSlice = createSlice({
  name: "product",
  initialState: initialState,
  reducers: {
    clearProductError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch product by ID
    builder.addCase(fetchProductById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProductById.fulfilled,
      (state, action: PayloadAction<ProductDTO>) => {
        state.loading = false;
        state.product = action.payload;
        state.currentProduct = action.payload;
      }
    );
    builder.addCase(fetchProductById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
    // Fetch products
    builder.addCase(fetchProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchProducts.fulfilled,
      (state, action: PayloadAction<ProductDTO[]>) => {
        state.loading = false;
        state.products = action.payload;
      }
    );
    builder.addCase(fetchProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch all products
    builder.addCase(fetchAllProducts.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchAllProducts.fulfilled,
      (state, action: PayloadAction<ApiResponse<ProductDTO[]>>) => {
        state.loading = false;
        state.products = action.payload.data;
        state.pagination = action.payload.pagination;
      }
    );
    builder.addCase(fetchAllProducts.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // TODO: Add product
    builder.addCase(addProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      addProduct.fulfilled,
      (state, action: PayloadAction<ProductDTO>) => {
        state.loading = false;
        // convert the response to a product
        const newProduct = {
          ...action.payload,
          id: state.products.length + 1,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        state.products.push(newProduct);
      }
    );
    builder.addCase(addProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete product
    builder.addCase(deleteProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteProduct.fulfilled,
      (state, action: PayloadAction<number>) => {
        state.loading = false;
        state.products = state.products.filter(
          (product) => product.id !== action.payload
        );
      }
    );
    builder.addCase(deleteProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // TODO: Update product
    builder.addCase(updateProduct.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateProduct.fulfilled,
      (state, action: PayloadAction<ProductDTO>) => {
        state.loading = false;
        const index = state.products.findIndex(
          (product) => product.id === action.payload.id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      }
    );
    builder.addCase(updateProduct.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearProductError } = productSlice.actions;
export default productSlice.reducer;
