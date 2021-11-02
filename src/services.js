export const baseApiUrl = "http://localhost:3004/";

export const orderServices = {
  getOrderList: "orders",
  getOrderDetails: (orderId) => `orders/${orderId}`,
  updateOrder: (orderId) => `orders/${orderId}`,
};

export const productServices = {
  getProductDetails: (productId) => `products/${productId}`,
};
