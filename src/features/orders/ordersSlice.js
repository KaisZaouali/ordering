import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getOrderListAsync,
  getOrderDetailsAsync,
  updateOrderAsync,
} from "./ordersAPI";
import { transformOrderListData, transformOrderDetailsData } from "./helper";

export const initialState = {
  orders: {},
  areOrderListFetched: false,
  loading: {
    getOrderListLoading: false,
    getOrderDetailsLoading: false,
    updateOrderLoading: false,
  },
  errors: {
    getOrderListErrors: null,
    getOrderDetailsErrors: null,
    updateOrderErrors: null,
  },
  notifications: {
    updateOrderNotification: false,
  },
};
export const getOrderList = createAsyncThunk(
  "orders/getOrderList",
  getOrderListAsync
);
export const getOrderDetails = createAsyncThunk(
  "orders/getOrderDetails",
  getOrderDetailsAsync
);
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  updateOrderAsync
);

export const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderErrors: (state) => {
      state.errors = initialState.errors;
    },
    clearOrderNotifications: (state) => {
      state.notifications = initialState.notifications;
    },
  },
  extraReducers: (builder) => {
    builder
      /* get order list */
      .addCase(getOrderList.pending, (state) => {
        state.loading.getOrderListLoading = true;
      })
      .addCase(getOrderList.fulfilled, (state, action) => {
        state.orders = transformOrderListData(action.payload);
        state.loading.getOrderListLoading = false;
        state.areOrderListFetched = true;
      })
      .addCase(getOrderList.rejected, (state, action) => {
        state.errors.getOrderListErrors = action.error.message;
        state.loading.getOrderListLoading = false;
      })

      /* get order details */
      .addCase(getOrderDetails.pending, (state) => {
        state.loading.getOrderDetailsLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.orders[action.payload.id] = transformOrderDetailsData(
          action.payload
        );
        state.loading.getOrderDetailsLoading = false;
      })
      .addCase(getOrderDetails.rejected, (state, action) => {
        state.errors.getOrderDetailsErrors = action.error.message;
        state.loading.getOrderDetailsLoading = false;
      })

      /* update order */
      .addCase(updateOrder.pending, (state) => {
        state.loading.updateOrderLoading = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.orders[action.payload.id] = transformOrderDetailsData(
          action.payload
        );
        state.loading.updateOrderLoading = false;
        state.notifications.updateOrderNotification = true;
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.errors.updateOrderErrors = action.error.message;
        state.loading.updateOrderLoading = false;
      });
  },
});

export const { clearOrderErrors, clearOrderNotifications } =
  ordersSlice.actions;

export const selectOrdersStore = (state) => state.orders;

export default ordersSlice.reducer;
