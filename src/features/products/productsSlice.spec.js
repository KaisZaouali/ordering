import productsReducer, {
  clearProductErrors,
  initialState,
} from "./productsSlice";
import * as messages from "../../shared/utils/messages";
import { transformOrderProductData } from "./helper";

describe("Products Reducer", () => {
  const product = {
    id: "A101",
    description: "Screwdriver",
    category: "1",
    price: "9.75",
  };

  it("should handle initial state", () => {
    expect(productsReducer(undefined, { type: "unknown" })).toEqual(
      initialState
    );
  });

  it("should handle get product details", () => {
    const getProductDetails = () => ({
      pending: { type: "products/getProductDetails/pending" },
      fulfilled: {
        type: "products/getProductDetails/fulfilled",
        payload: product,
      },
      rejected: {
        type: "products/getProductDetails/rejected",
        error: { message: messages.ERROR_MESSAGE },
      },
    });

    /* pending state */
    const pending = productsReducer(initialState, getProductDetails().pending);
    expect(pending.loading.getProductDetailsLoading).toEqual(true);

    /* fulfilled state */
    const fulfilled = productsReducer(
      {
        ...initialState,
        loading: { ...initialState.loading, getProductDetailsLoading: true },
      },
      getProductDetails().fulfilled
    );
    expect(fulfilled.products).toEqual({
      [product.id]: transformOrderProductData(product),
    });
    expect(fulfilled.loading.getProductDetailsLoading).toEqual(false);

    /* rejected state */
    const rejected = productsReducer(
      {
        ...initialState,
        loading: { ...initialState.loading, getProductDetailsLoading: true },
      },
      getProductDetails().rejected
    );
    expect(rejected.errors.getProductDetailsErrors).toEqual(
      messages.ERROR_MESSAGE
    );
    expect(rejected.loading.getProductDetailsLoading).toEqual(false);
  });

  it("should handle clearProductErrors", () => {
    const actual = productsReducer(
      {
        ...initialState,
        errors: {
          ...initialState.errors,
          getProductDetailsErrors: messages.ERROR_MESSAGE,
        },
      },
      clearProductErrors()
    );
    expect(actual.errors).toEqual(initialState.errors);
  });
});
