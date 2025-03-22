import {
  createSlice,
  createAsyncThunk,
  PayloadAction,
} from "@reduxjs/toolkit";
import { AuthState, User } from "../../types";
import authController from "../../controllers/AuthController";
import * as localStorageUtil from "../../utils/localStorageUtil";

// Initial state
const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  // token: null,
  loading: false,
  error: null,
};

// Check is authenticated or not by token in cookie
export const checkAuthenticated = createAsyncThunk(
  "auth/is-authenticated",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authController.isAuthenticated();
      const { isAuthenticated, user, token } = response.data;

      return { isAuthenticated, user, token };
    } catch (error: any) {  
      return rejectWithValue(
        error.message || "Checking authenticating is failed"
      );
    }
  }
);

// Async thunk for user login
export const signIn = createAsyncThunk(
  "auth/signin",
  async (
    credentials: { email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authController.signIn(credentials);
      const { token, user } = response.data;
      // Save token to local storage
      localStorageUtil.setTokenInLocalStorage(token);
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.message || "Login failed");
    }
  }
);

// Async thunk for user registration
export const signUp = createAsyncThunk(
  "auth/signup",
  async (
    userData: { name: string; email: string; password: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await authController.signUp(userData);
      const { token, user } = response.data;
      // Save token to local storage
      localStorageUtil.setTokenInLocalStorage(token);
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.message || "Registration failed");
    }
  }
);

// Async thunk for loading user profile
export const loadUser = createAsyncThunk(
  "auth/loadUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await authController.getMe();
      
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to load user");
    }
  }
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authController.logout();
      return null;
    } catch (error: any) {
      localStorageUtil.removeTokenInLocalStorage();

      return rejectWithValue(error.message || "Logout failed");
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Check is authenticated
    builder.addCase(checkAuthenticated.pending, (state) => {
      state.loading = true;
      state.error = null;
    });

    builder.addCase(
      checkAuthenticated.fulfilled,
      (
        state,
        action: PayloadAction<{ isAuthenticated: boolean; user: User, token: string }>
      ) => {
        state.isAuthenticated = action.payload.isAuthenticated;
        state.user = action.payload.user;
        // state.token = action.payload.token;
        state.loading = false;
      }
    );
    builder.addCase(checkAuthenticated.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Login
    builder.addCase(signIn.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      signIn.fulfilled,
      (state, action: PayloadAction<{ token: string, user: User }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        // state.token = action.payload.token;
      }
    );
    builder.addCase(signIn.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Register
    builder.addCase(signUp.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(
      signUp.fulfilled,
      (state, action: PayloadAction<{ token: string; user: User }>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        // state.token = action.payload.token;
      }
    );
    builder.addCase(signUp.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Load User
    builder.addCase(loadUser.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(
      loadUser.fulfilled,
      (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload;
        
      }
    );
    builder.addCase(loadUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Logout
    builder.addCase(logoutUser.fulfilled, (state) => {
      state.user = null;
      state.isAuthenticated = false;
    });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
