import {
  transformItem,
  transformOrderItems,
  transformOrderDetailsData,
  transformOrderListData,
  reverseTransformItem,
  reverseTransformOrderItems,
  reverseOrderDetailsTransformation,
} from "./helper";

const item = {
  "product-id": "B102",
  quantity: "10",
  "unit-price": "4.99",
  total: "49.9",
};

const transformedItem = {
  productId: "B102",
  quantity: 10,
  unitPrice: 4.99,
  total: 49.9,
};

const order = {
  id: "1",
  "customer-id": "1",
  items: [
    {
      "product-id": "B102",
      quantity: "10",
      "unit-price": "4.99",
      total: "49.9",
    },
  ],
  total: "49.9",
};

const transformedOrder = {
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

describe("transformItem helper function", () => {
  it("transformItem should transform quantity, unit-price and total to numbers", () => {
    expect(typeof transformItem(item).quantity).toEqual("number");
    expect(typeof transformItem(item).unitPrice).toEqual("number");
    expect(typeof transformItem(item).total).toEqual("number");
  });

  it("transformItem should transform product-id to productId, and unit-price to unitPrice", () => {
    expect(transformItem(item).productId).toEqual(item["product-id"]);
    expect(transformItem(item).unitPrice).toEqual(Number(item["unit-price"]));
  });

  it("should not change values", () => {
    expect(transformItem(item)).toEqual(transformedItem);
  });
});

describe("transformOrderDetailsData helper function", () => {
  it("transformOrderDetailsData should transform total to numbers", () => {
    expect(typeof transformOrderDetailsData(order).total).toEqual("number");
  });

  it("transformOrderDetailsData should transform customer-id to customerId", () => {
    expect(transformOrderDetailsData(order).customerId).toEqual(
      order["customer-id"]
    );
  });

  it("transformOrderDetailsData should transform items", () => {
    expect(transformOrderDetailsData(order).items).toEqual(
      transformOrderItems(order.items)
    );
  });

  it("should not change values", () => {
    expect(transformOrderDetailsData(order)).toEqual(transformedOrder);
  });
});

describe("transformOrderListData helper function", () => {
  it("transformOrderListData should transform orders", () => {
    expect(transformOrderListData([order])).toEqual({
      [order.id]: transformOrderDetailsData(order),
    });
  });
});

describe("reverseTransformItem helper function", () => {
  it("reverseTransformItem should transform quantity, unitPrice and total to strings", () => {
    expect(typeof reverseTransformItem(transformedItem).quantity).toEqual(
      "string"
    );
    expect(typeof reverseTransformItem(transformedItem)["unit-price"]).toEqual(
      "string"
    );
    expect(typeof reverseTransformItem(transformedItem).total).toEqual(
      "string"
    );
  });

  it("reverseTransformItem should transform productId to product-id, and unitPrice to unit-price", () => {
    expect(reverseTransformItem(transformedItem)["product-id"]).toEqual(
      transformedItem.productId
    );
    expect(Number(reverseTransformItem(transformedItem)["unit-price"])).toEqual(
      transformedItem.unitPrice
    );
  });

  it("should not change values", () => {
    expect(reverseTransformItem(transformedItem)).toEqual(item);
  });
});

describe("reverseOrderDetailsTransformation helper function", () => {
  it("reverseOrderDetailsTransformation should transform total to string", () => {
    expect(
      typeof reverseOrderDetailsTransformation(transformedOrder).total
    ).toEqual("string");
  });

  it("reverseOrderDetailsTransformation should transform customerId to customer-id ", () => {
    expect(
      reverseOrderDetailsTransformation(transformedOrder)["customer-id"]
    ).toEqual(transformedOrder.customerId);
  });

  it("reverseOrderDetailsTransformation should reverse transform items", () => {
    expect(reverseOrderDetailsTransformation(transformedOrder).items).toEqual(
      reverseTransformOrderItems(transformedOrder.items)
    );
  });

  it("should not change values", () => {
    expect(reverseOrderDetailsTransformation(transformedOrder)).toEqual(order);
  });
});
