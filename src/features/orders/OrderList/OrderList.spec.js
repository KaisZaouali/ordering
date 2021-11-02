import React from "react";
import { shallow, render } from "enzyme";
import { Provider } from "react-redux";
import OrderList from "./OrderList";
import ordersReducer, { initialState } from "../ordersSlice";
import { configureStore } from "@reduxjs/toolkit";

describe("Order List Component with empty list", () => {
  const store = configureStore({
    reducer: {
      orders: ordersReducer,
    },
  });
  let container;
  let shallowContainer = shallow(
    <Provider store={store}>
      <OrderList />
    </Provider>
  );

  beforeEach(
    () =>
      (container = render(
        <Provider store={store}>
          <OrderList />
        </Provider>
      ))
  );

  it("should component be rendering ", () => {
    expect(shallowContainer.find("OrderList").length).toEqual(1);
  });

  it("should component render title ", () => {
    expect(container.text().includes("Order List")).toBe(true);
  });

  it("should component render no data ", () => {
    expect(container.text().includes("No Data")).toBe(true);
  });
});

describe("Order List Component with an order", () => {
  let container;

  const order = {
    id: "1",
    customerId: "1",
    items: [
      {
        productId: "B102",
        quantity: 10,
        unitPrice: 4.99,
        total: 49.9,
      },
    ],
    total: 49.9,
  };

  const store = {
    getState: () => ({
      orders: {
        ...initialState,
        orders: { [order.id]: order },
      },
    }),
    dispatch: () => {},
    subscribe: () => {},
  };

  beforeEach(
    () =>
      (container = render(
        <Provider store={store}>
          <OrderList />
        </Provider>
      ))
  );

  it("should not render no-data component", () => {
    expect(container.text().includes("No Data")).toBe(false);
  });

  it("should component render an order", () => {
    expect(container.find("li").length).toEqual(1);
  });
});
