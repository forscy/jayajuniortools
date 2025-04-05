import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse, Pagination } from "../../controllers/BaseController";
import { UserCreateDTO, UserDTO } from "../../dto/user.dto";
import userController from "../../controllers/UserController";

interface UserState {
  users: UserDTO[]; // Changed from optional to required with empty array default
  user: UserDTO | null;
  loading: boolean;
  error?: string;
  pagination?: Pagination;
}

const initialState: UserState = {
  users: [], // Initialize as empty array instead of undefined
  user: null,
  loading: false,
  error: undefined,
  pagination: undefined,
};

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData: UserCreateDTO, { rejectWithValue }) => {
    try {
      const response = await userController.createUser(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create user");
    }
  }
);

// Async thunk for fetching all users
export const fetchUsers = createAsyncThunk(
  "user/fetchUsers",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await userController.getUsers(params || {});
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch users");
    }
  }
);

// Async thunk for update user status
export const updateUserStatus = createAsyncThunk(
  "user/updateUserStatus",
  async (userData: UserDTO, { rejectWithValue }) => {
    try {
      const response = await userController.updateUserStatus(userData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to update user status"
      );
    }
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createUser.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload); // Use push on array instead of spread
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch users
    builder.addCase(fetchUsers.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      fetchUsers.fulfilled,
      (state, action: PayloadAction<ApiResponse<UserDTO[]>>) => {
        state.loading = false;
        // Ensure users is always an array
        state.users = action.payload.data || [];
        state.pagination = action.payload.pagination;
      }
    );
    builder.addCase(fetchUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update user status
    builder
      .addCase(updateUserStatus.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateUserStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Make sure users exists and is an array before mapping
        if (Array.isArray(state.users)) {
          state.users = state.users.map((user) =>
            user.id === action.payload.id ? action.payload : user
          );
        }
      })
      .addCase(updateUserStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

  },
});

export const { actions: userActions } = userSlice;
export default userSlice.reducer;
