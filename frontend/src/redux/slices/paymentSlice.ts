import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ApiResponse, Pagination } from "../../controllers/BaseController";
import { PaymentCreateDTO, PaymentDTO } from "../../dto/payment.dto";
import paymentController from "../../controllers/PaymentController";

interface PaymentState {
  payments: PaymentDTO[]; // Changed from optional to required with empty array default
  payment: PaymentDTO | null;
  loading: boolean;
  error?: string;
  pagination?: Pagination;
}

const initialState: PaymentState = {
  payments: [], // Initialize as empty array instead of undefined
  payment: null,
  loading: false,
  error: undefined,
  pagination: undefined,
};

export const createPayment = createAsyncThunk(
  "payment/createPayment",
  async (paymentData: PaymentCreateDTO, { rejectWithValue }) => {
    try {
      const response = await paymentController.createPayment(paymentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create payment");
    }
  }
);

// Async thunk for fetching all payments
export const fetchPayments = createAsyncThunk(
  "payment/fetchPayments",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await paymentController.getPayments(params || {});
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch payments");
    }
  }
);

// Async thunk for update payment status
export const updatePaymentStatus = createAsyncThunk(
  "payment/updatePaymentStatus",
  async (paymentData: PaymentDTO, { rejectWithValue }) => {
    try {
      const response = await paymentController.updatePaymentStatus(paymentData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to update payment status"
      );
    }
  }
);

export const pay = createAsyncThunk(
  "payment/pay",
  async (
    {
      paymentId,
      amountPaid,
    }: {
      paymentId: number;
      amountPaid: number;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await paymentController.pay({
        paymentId,
        amountPaid,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to update payment status"
      );
    }
  }
);

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPayment.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(createPayment.fulfilled, (state, action) => {
        state.loading = false;
        state.payments.push(action.payload); // Use push on array instead of spread
      })
      .addCase(createPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Fetch payments
    builder.addCase(fetchPayments.pending, (state) => {
      state.loading = true;
      state.error = undefined;
    });
    builder.addCase(
      fetchPayments.fulfilled,
      (state, action: PayloadAction<ApiResponse<PaymentDTO[]>>) => {
        state.loading = false;
        // Ensure payments is always an array
        state.payments = action.payload.data || [];
        state.pagination = action.payload.pagination;
      }
    );
    builder.addCase(fetchPayments.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Update payment status
    builder
      .addCase(updatePaymentStatus.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(updatePaymentStatus.fulfilled, (state, action) => {
        state.loading = false;
        // Make sure payments exists and is an array before mapping
        if (Array.isArray(state.payments)) {
          state.payments = state.payments.map((payment) =>
            payment.id === action.payload.id ? action.payload : payment
          );
        }
      })
      .addCase(updatePaymentStatus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Handle pay action
    builder
      .addCase(pay.pending, (state) => {
        state.loading = true;
        state.error = undefined;
      })
      .addCase(pay.fulfilled, (state, action) => {
        state.loading = false;
        // Update the payment in the array
        if (Array.isArray(state.payments)) {
          state.payments = state.payments.map((payment) =>
            payment.id === action.payload.id ? action.payload : payment
          );
        }
      })
      .addCase(pay.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { actions: paymentActions } = paymentSlice;
export default paymentSlice.reducer;
