import ordersReducer, {
  clearOrderErrors,
  clearOrderNotifications,
  initialState,
} from "./ordersSlice";
import * as messages from "../../shared/utils/messages";
import { transformOrderListData, transformOrderDetailsData } from "./helper";

describe("Orders Reducer", () => {
  const order = {
    id: "1",
    "customer-id": "1",
    items: [
      {
        "product-id": "B102",
        quantity: "10",
        "unit-price": "4.99",
        total: "49.90",
      },
    ],
    total: "49.90",
  };

  it("should handle initial state", () => {
    expect(ordersReducer(undefined, { type: "unknown" })).toEqual(initialState);
  });

  it("should handle get order list", () => {
    const getOrderList = () => ({
      pending: { type: "orders/getOrderList/pending" },
      fulfilled: {
        type: "orders/getOrderList/fulfilled",
        payload: [order],
      },
      rejected: {
        type: "orders/getOrderList/rejected",
        error: { message: messages.ERROR_MESSAGE },
      },
    });

    /* pending state */
    const pending = ordersReducer(initialState, getOrderList().pending);
    expect(pending.loading.getOrderListLoading).toEqual(true);

    /* fulfilled state */
    const fulfilled = ordersReducer(
      {
        ...initialState,
        loading: { ...initialState.loading, getOrderListLoading: true },
      },
      getOrderList().fulfilled
    );
    expect(fulfilled.orders).toEqual(transformOrderListData([order]));
    expect(fulfilled.areOrderListFetched).toEqual(true);
    expect(fulfilled.loading.getOrderListLoading).toEqual(false);

    /* rejected state */
    const rejected = ordersReducer(
      {
        ...initialState,
        loading: { ...initialState.loading, getOrderListLoading: true },
      },
      getOrderList().rejected
    );
    expect(rejected.errors.getOrderListErrors).toEqual(messages.ERROR_MESSAGE);
    expect(rejected.loading.getOrderListLoading).toEqual(false);
  });

  it("should handle get order details", () => {
    const getOrderDetails = () => ({
      pending: { type: "orders/getOrderDetails/pending" },
      fulfilled: {
        type: "orders/getOrderDetails/fulfilled",
        payload: order,
      },
      rejected: {
        type: "orders/getOrderDetails/rejected",
        error: { message: messages.ERROR_MESSAGE },
      },
    });

    /* pending state */
    const pending = ordersReducer(initialState, getOrderDetails().pending);
    expect(pending.loading.getOrderDetailsLoading).toEqual(true);

    /* fulfilled state */
    const fulfilled = ordersReducer(
      {
        ...initialState,
        loading: { ...initialState.loading, getOrderDetailsLoading: true },
      },
      getOrderDetails().fulfilled
    );
    expect(fulfilled.orders).toEqual({
      [order.id]: transformOrderDetailsData(order),
    });
    expect(fulfilled.loading.getOrderDetailsLoading).toEqual(false);

    /* rejected state */
    const rejected = ordersReducer(
      {
        ...initialState,
        loading: { ...initialState.loading, getOrderDetailsLoading: true },
      },
      getOrderDetails().rejected
    );
    expect(rejected.errors.getOrderDetailsErrors).toEqual(
      messages.ERROR_MESSAGE
    );
    expect(rejected.loading.getOrderDetailsLoading).toEqual(false);
  });

  it("should handle update order", () => {
    const updatedOrder = {
      id: "1",
      "customer-id": "1",
      items: [],
      total: "49.90",
    };
    const updateOrder = () => ({
      pending: { type: "orders/updateOrder/pending" },
      fulfilled: {
        type: "orders/updateOrder/fulfilled",
        payload: updatedOrder,
      },
      rejected: {
        type: "orders/updateOrder/rejected",
        error: { message: messages.ERROR_MESSAGE },
      },
    });

    /* pending state */
    const pending = ordersReducer(initialState, updateOrder().pending);
    expect(pending.loading.updateOrderLoading).toEqual(true);

    /* fulfilled state */
    const fulfilled = ordersReducer(
      {
        ...initialState,
        orders: { [order.id]: order },
        loading: { ...initialState.loading, updateOrderLoading: true },
      },
      updateOrder().fulfilled
    );
    expect(fulfilled.orders).toEqual({
      [order.id]: transformOrderDetailsData(updatedOrder),
    });
    expect(fulfilled.loading.updateOrderLoading).toEqual(false);
    expect(fulfilled.notifications.updateOrderNotification).toEqual(true);

    /* rejected state */
    const rejected = ordersReducer(
      {
        ...initialState,
        loading: { ...initialState.loading, updateOrderLoading: true },
      },
      updateOrder().rejected
    );
    expect(rejected.errors.updateOrderErrors).toEqual(messages.ERROR_MESSAGE);
    expect(rejected.loading.updateOrderLoading).toEqual(false);
  });

  it("should handle clearOrderErrors", () => {
    const actual = ordersReducer(
      {
        ...initialState,
        errors: {
          ...initialState.errors,
          updateOrderErrors: messages.ERROR_MESSAGE,
        },
      },
      clearOrderErrors()
    );
    expect(actual.errors).toEqual(initialState.errors);
  });

  it("should handle clearOrderNotifications", () => {
    const actual = ordersReducer(
      {
        ...initialState,
        notifications: {
          ...initialState.notifications,
          updateOrderNotification: true,
        },
      },
      clearOrderNotifications()
    );
    expect(actual.notifications).toEqual(initialState.notifications);
  });
});
