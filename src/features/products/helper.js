export const transformOrderProductData = (orderProduct) => ({
  ...orderProduct,
  price: Number(orderProduct.price),
});
