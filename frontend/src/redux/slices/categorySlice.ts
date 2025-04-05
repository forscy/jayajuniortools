import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import categoryController from "../../controllers/CategoryController";
import { CategoryDTO } from "../../dto/category.dto";

// Define the state interface
interface CategoryState {
  categories: CategoryDTO[];
  category: CategoryDTO | null;
  loading: boolean;
  error: string | null;
  pagination: {
    totalItems: number;
    pageSize: number;
    totalPages: number;
    currentPage: number;
  } | null;
}

// Initial state
const initialState: CategoryState = {
  categories: [],
  category: null,
  loading: false,
  error: null,
  pagination: null,
};

// Async thunk for fetching all categories
export const fetchCategories = createAsyncThunk(
  "category/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await categoryController.getCategories();
      return {
        categories: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch categories");
    }
  }
);

// Async thunk for fetching a single category by ID
export const fetchCategoryById = createAsyncThunk(
  "category/fetchCategoryById",
  async (categoryId: number, { rejectWithValue }) => {
    try {
      const response = await categoryController.getCategoryById(categoryId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch category");
    }
  }
);

// Async thunk for creating a new category
export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (categoryData: CategoryDTO, { rejectWithValue }) => {
    try {
      const response = await categoryController.createCategory(categoryData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create category");
    }
  }
);

// Async thunk for updating a category
export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (
    { id, data }: { id: number; data: CategoryDTO },
    { rejectWithValue }
  ) => {
    try {
      const response = await categoryController.updateCategory(id, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update category");
    }
  }
);

// Async thunk for deleting a category
export const deleteCategory = createAsyncThunk(
  "category/deleteCategory",
  async (categoryName: string, { rejectWithValue }) => {
    try {
      await categoryController.deleteCategory(categoryName);
      return categoryName; // Return the ID to remove it from state
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete category");
    }
  }
);

// Async thunk for searching categories
export const searchCategories = createAsyncThunk(
  "category/searchCategories",
  async (
    {
      searchTerm,
      page = 1,
      limit = 10,
    }: {
      searchTerm: string;
      page?: number;
      limit?: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await categoryController.searchCategories(
        searchTerm,
        page,
        limit
      );
      return {
        categories: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to search categories");
    }
  }
);

// Create the category slice
const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    clearCategoryError: (state) => {
      state.error = null;
    },
    clearSelectedCategory: (state) => {
      state.category = null;
    },
  },
  extraReducers: (builder) => {
    // Fetch categories
    builder.addCase(fetchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCategories.fulfilled,
      (
        state,
        action: PayloadAction<{ categories: CategoryDTO[]; pagination: any }>
      ) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.pagination = action.payload.pagination;
      }
    );
    builder.addCase(fetchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Fetch category by ID
    builder.addCase(fetchCategoryById.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      fetchCategoryById.fulfilled,
      (state, action: PayloadAction<CategoryDTO>) => {
        state.loading = false;
        state.category = action.payload;
      }
    );
    builder.addCase(fetchCategoryById.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create category
    builder.addCase(createCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      createCategory.fulfilled,
      (state, action: PayloadAction<CategoryDTO>) => {
        state.loading = false;
        state.categories.push(action.payload);
        state.category = action.payload;
      }
    );
    builder.addCase(createCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update category
    builder.addCase(updateCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      updateCategory.fulfilled,
      (state, action: PayloadAction<CategoryDTO>) => {
        state.loading = false;
      }
    );
    builder.addCase(updateCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Delete category
    builder.addCase(deleteCategory.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      deleteCategory.fulfilled,
      (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.categories = state.categories.filter(
          (category: any) => category.id !== action.payload
        );
        if (state.category && state.category.name === action.payload) {
          state.category = null;
        }
      }
    );
    builder.addCase(deleteCategory.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Search categories
    builder.addCase(searchCategories.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      searchCategories.fulfilled,
      (
        state,
        action: PayloadAction<{ categories: CategoryDTO[]; pagination: any }>
      ) => {
        state.loading = false;
        state.categories = action.payload.categories;
        state.pagination = action.payload.pagination;
      }
    );
    builder.addCase(searchCategories.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export const { clearCategoryError, clearSelectedCategory } =
  categorySlice.actions;
export default categorySlice.reducer;
