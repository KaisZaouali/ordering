export const transformOrderListData = (orderList) =>
  orderList.reduce(
    (result, order) => ({
      ...result,
      [order.id]: transformOrderDetailsData(order),
    }),
    {}
  );

export const transformItem = (item) => ({
  productId: item["product-id"],
  quantity: Number(item.quantity),
  unitPrice: Number(item["unit-price"]),
  total: Number(item.total),
});

export const transformOrderItems = (items) =>
  items.map((product) => transformItem(product));

export const transformOrderDetailsData = (orderDetails) => ({
  id: orderDetails.id,
  customerId: orderDetails["customer-id"],
  items: transformOrderItems(orderDetails.items),
  total: Number(orderDetails.total),
});

export const reverseTransformItem = (item) => ({
  "product-id": item.productId,
  quantity: String(item.quantity),
  "unit-price": String(item.unitPrice),
  total: String(item.total),
});

export const reverseTransformOrderItems = (items) =>
  items.map((product) => reverseTransformItem(product));

export const reverseOrderDetailsTransformation = (updatedOrder) => ({
  id: updatedOrder.id,
  "customer-id": updatedOrder.customerId,
  items: reverseTransformOrderItems(updatedOrder.items),
  total: String(updatedOrder.total),
});
