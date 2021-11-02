import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getProductDetailsAsync } from "./productsAPI";
import { transformOrderProductData } from "./helper";

export const initialState = {
  products: {},
  loading: {
    getProductDetailsLoading: false,
  },
  errors: {
    getProductDetailsErrors: null,
  },
};
export const getProductDetails = createAsyncThunk(
  "products/getProductDetails",
  getProductDetailsAsync
);

export const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    clearProductErrors: (state) => {
      state.errors = initialState.errors;
    },
  },
  extraReducers: (builder) => {
    builder
      /* get product details */
      .addCase(getProductDetails.pending, (state) => {
        state.loading.getProductDetailsLoading = true;
      })
      .addCase(getProductDetails.fulfilled, (state, action) => {
        state.products[action.payload.id] = transformOrderProductData(
          action.payload
        );
        state.loading.getProductDetailsLoading = false;
      })
      .addCase(getProductDetails.rejected, (state, action) => {
        state.errors.getProductDetailsErrors = action.error.message;
        state.loading.getProductDetailsLoading = false;
      });
  },
});

export const { clearProductErrors } = productsSlice.actions;

export const selectProductsStore = (state) => state.products;

export default productsSlice.reducer;
