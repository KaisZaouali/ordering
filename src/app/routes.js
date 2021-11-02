import OrderList from "../features/orders/OrderList/OrderList";
import OrderDetails from "../features/orders/OrderDetails/OrderDetails";

const routes = {
  orderList: {
    path: "/orders",
    component: OrderList,
  },
  orderDetails: {
    path: "/orders/:orderId",
    linkPath: (orderId) => `/orders/${orderId}`,
    component: OrderDetails,
  },
};

export default routes;
