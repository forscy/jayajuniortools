import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { Pagination } from "../../controllers/BaseController";
import { OrderCreateDTO, OrderDTO } from "../../dto/order.dto";
import orderController from "../../controllers/OrderController";

interface OrderState {
  orders?: OrderDTO[];
  order?: OrderDTO;
  loading: boolean;
  error?: string;
  pagination?: Pagination;
}

const initialState: OrderState = {
  orders: undefined,
  order: undefined,
  loading: false,
  error: undefined,
  pagination: undefined,
};

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: OrderCreateDTO, { rejectWithValue }) => {
    try {
      const response = await orderController.createOrder(orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create order");
    }
  }
);

// Async thunk for fetching all orders
export const fetchOrders = createAsyncThunk(
  "order/fetchOrders",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await orderController.getOrders(params || {});
      return {
        orders: response.data,
        pagination: response.pagination,
      };
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch orders");
    }
  }
);

// Async thunk for update order status
export const updateOrderStatus = createAsyncThunk(
  "order/updateOrderStatus",
  async (orderData: OrderDTO, { rejectWithValue }) => {
    try {
      const response = await orderController.updateOrderStatus(orderData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update order status");
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = [...(state.orders || []), action.payload];
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // TODO: fetch
    builder
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // TODO: update
    builder
      .addCase(updateOrderStatus.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = state.orders?.map((order) =>
          order.id === action.payload.id ? action.payload : order
        );
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { actions: orderActions } = orderSlice;
export default orderSlice.reducer;
