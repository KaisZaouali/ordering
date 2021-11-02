import axios from "axios";
import { baseApiUrl, orderServices } from "../../services";

export const getOrderListAsync = async () => {
  const result = await axios.get(baseApiUrl + orderServices.getOrderList);
  return result.data;
};

export const getOrderDetailsAsync = async (orderId) => {
  const result = await axios.get(
    baseApiUrl + orderServices.getOrderDetails(orderId)
  );
  return result.data;
};

export const updateOrderAsync = async (order) => {
  const result = await axios.put(
    baseApiUrl + orderServices.updateOrder(order.id),
    order
  );
  return result.data;
};
