import { configureStore } from "@reduxjs/toolkit";
import ordersReducer from "../features/orders/ordersSlice";
import productsReducer from "../features/products/productsSlice";

export const store = configureStore({
  reducer: {
    orders: ordersReducer,
    products: productsReducer,
  },
});
