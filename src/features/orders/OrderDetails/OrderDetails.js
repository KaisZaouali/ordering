import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Divider, Button, Row, Col } from "antd";
import {
  getOrderDetails,
  updateOrder,
  selectOrdersStore,
  clearOrderNotifications,
  clearOrderErrors,
} from "../ordersSlice";
import {
  getProductDetails,
  selectProductsStore,
  clearProductErrors,
} from "../../products/productsSlice";
import styles from "./OrderDetails.module.css";
import { useErrors, useNotifications } from "../../../shared/utils/hooks";
import LoadingWrapper from "../../../shared/components/LoadingWrapper/LoadingWrapper";
import routes from "../../../app/routes";
import OrderTitle from "../OrderTitle/OrderTitle";
import OrderProduct from "../OrderProduct/OrderProduct";
import OrderProductForm from "../OrderProductForm/OrderProductForm";
import { reverseOrderDetailsTransformation } from "../helper";
import { getFixedTwoDecimals } from "../../../shared/utils/number";
import { ORDER_UPDATE_NOTIFICATION } from "../../../shared/utils/messages";
import isEqual from "lodash.isequal";

const OrderDetails = () => {
  const {
    orders,
    areOrderListFetched,
    loading: orderLoading,
    errors: orderErrors,
    notifications,
  } = useSelector(selectOrdersStore);
  const { products, errors: productErrors } = useSelector(selectProductsStore);
  const { updateOrderLoading, getOrderDetailsLoading } = orderLoading;
  const { getOrderListError, ...orderDetailsErrors } = orderErrors;
  const dispatch = useDispatch();
  const history = useHistory();
  const { orderId } = useParams();

  /* local order to save the changes before confirming the update */
  const [order, setOrder] = useState(orders[orderId]);

  /* product that is going to be added to the local order but need first to fetch 
     the product data (e.g unit price) in order to update the total etc  */
  const [postponedAddProduct, setPostponedAddProduct] = useState(null);

  /* error and notification handling */
  useErrors(orderDetailsErrors, () => dispatch(clearOrderErrors()));
  useErrors(productErrors, () => dispatch(clearProductErrors()));
  useNotifications(
    notifications,
    { updateOrderNotification: ORDER_UPDATE_NOTIFICATION(order && order.id) },
    () => dispatch(clearOrderNotifications())
  );

  /* fetch order details data if 1/ the order list is not fetched yet (from the order list page)
     [or] 2/ if this order has not been fetched yet (from a previous landing on this order url) */
  useEffect(() => {
    if (!(areOrderListFetched || (orderId && orders[orderId])))
      dispatch(getOrderDetails(orderId));
  }, [dispatch, orderId, areOrderListFetched, orders]);

  /* to update the local state when switching order details
     pages or when receiving the order details data */
  useEffect(() => {
    setOrder(orders[orderId]);
  }, [orders, orderId]);

  /* to update the local order state upon receiving the fetched data of the newly added product */
  useEffect(() => {
    if (postponedAddProduct && !!products[postponedAddProduct.productId]) {
      const items = order.items.concat(
        aggregateAddProductData(
          products[postponedAddProduct.productId].price,
          postponedAddProduct
        )
      );
      setOrder({
        ...order,
        total: computeTotal(items),
        items,
      });
      setPostponedAddProduct(null);
    }
  }, [products, postponedAddProduct, order]);

  /* aggregate the data of the newly added product with its remaining data that is just fetched */
  const aggregateAddProductData = (unitPrice, product) => {
    const { productId, quantity } = product;
    return {
      productId,
      quantity,
      unitPrice,
      total: getFixedTwoDecimals(quantity * unitPrice),
    };
  };

  const computeTotal = (items) =>
    getFixedTwoDecimals(
      items.reduce((a, b) => a + b.quantity * b.unitPrice, 0)
    );

  const computeTotalAndSetOrder = (items) => {
    const total = computeTotal(items);
    setOrder({
      ...order,
      total,
      items,
    });
  };

  const goToOrderList = () => history.push(routes.orderList.path);

  const saveChangesAction = () => {
    if (
      !isEqual(orders[order.id], order) &&
      !updateOrderLoading &&
      !getOrderDetailsLoading
    ) {
      const updatedOrder = reverseOrderDetailsTransformation(order);
      dispatch(updateOrder(updatedOrder));
    }
  };

  const deleteProductAction = (productId) => {
    const items = order.items.filter(
      (product) => product.productId !== productId
    );
    computeTotalAndSetOrder(items);
  };

  const addProductAction = (product) => {
    /* if order has already this product that is we have just to update the quantity and the total */
    if (
      order.items.some(
        (orderProduct) => orderProduct.productId === product.productId
      )
    )
      changeProductQuantity(product);
    /* else if we have all the needed product data in the products reducer 
       that is we have just to add the product to the order */ else if (
      !!products[product.productId]
    )
      addProductToOrder(product);
    /* else if the products reducer does not contain the product data, that is we have to fetch the product
       data and then aggregate both product data objects and set it in the local order */ else
      addProductActionAsync(product);
  };

  const changeProductQuantity = (product) => {
    const items = order.items.map((orderProduct) =>
      orderProduct.productId === product.productId
        ? {
            ...orderProduct,
            quantity: orderProduct.quantity + product.quantity,
            total: getFixedTwoDecimals(
              orderProduct.total + orderProduct.unitPrice * product.quantity
            ),
          }
        : orderProduct
    );
    computeTotalAndSetOrder(items);
  };

  const addProductToOrder = (product) => {
    const { price } = products[product.productId];
    const items = order.items.concat(aggregateAddProductData(price, product));
    computeTotalAndSetOrder(items);
  };

  const addProductActionAsync = (product) => {
    setPostponedAddProduct(product);
    dispatch(getProductDetails(product.productId));
  };

  if (!order) return <div></div>;

  return (
    <div>
      <Divider orientation="center">Order Details</Divider>
      <div className={styles.orderDetails}>
        <div className={styles.header}>
          <LoadingWrapper
            loading={getOrderDetailsLoading || updateOrderLoading}
          >
            <OrderTitle
              total={order.total}
              id={order.id}
              itemsLength={order.items.length}
            />
            <div>{`Customer ID: ${order.customerId}`}</div>
            <Button
              onClick={saveChangesAction}
              disabled={
                updateOrderLoading ||
                getOrderDetailsLoading ||
                isEqual(orders[order.id], order)
              }
            >
              Save Changes
            </Button>
          </LoadingWrapper>
          <Button onClick={goToOrderList}>Back to oder list</Button>
        </div>
        <LoadingWrapper loading={getOrderDetailsLoading || updateOrderLoading}>
          <Row gutter={16}>
            <Col span={8}>
              <OrderProductForm addProductAction={addProductAction} />
            </Col>
            {Object.values(order.items).map((product) => (
              <Col key={product.productId} span={8}>
                <OrderProduct
                  orderProduct={product}
                  deleteProductAction={deleteProductAction}
                />
              </Col>
            ))}
          </Row>
        </LoadingWrapper>
      </div>
    </div>
  );
};

export default OrderDetails;
