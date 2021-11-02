import React, { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { List, Divider } from "antd";
import {
  getOrderList,
  selectOrdersStore,
  clearOrderErrors,
} from "../ordersSlice";
import styles from "./OrderList.module.css";
import { useErrors } from "../../../shared/utils/hooks";
import LoadingWrapper from "../../../shared/components/LoadingWrapper/LoadingWrapper";
import routes from "../../../app/routes";
import OrderTitle from "../OrderTitle/OrderTitle";

const OrderList = () => {
  const { orders, areOrderListFetched, loading, errors } =
    useSelector(selectOrdersStore);
  const { getOrderListLoading } = loading;
  const { getOrderListErrors } = errors;
  const dispatch = useDispatch();
  const history = useHistory();

  useErrors({ getOrderListErrors }, () => dispatch(clearOrderErrors()));

  useEffect(() => {
    /* this will ensure that orders list will be fetched only once -
       we can't just test if the order list is empty because
       the order details component may fetch an order and save it in the
       order list */
    if (!areOrderListFetched) dispatch(getOrderList());
  }, [dispatch, areOrderListFetched]);

  const goToOrderDetails = (orderId) =>
    history.push(routes.orderDetails.linkPath(orderId));

  return (
    <div>
      <Divider orientation="left">Order List</Divider>
      <div className={styles.orderList}>
        <LoadingWrapper loading={getOrderListLoading}>
          <List
            size="large"
            bordered
            className={styles.list}
            dataSource={Object.values(orders)}
            rowKey={({ id }) => id}
            renderItem={({ total, id, items }) => (
              <List.Item onClick={() => goToOrderDetails(id)}>
                <OrderTitle total={total} id={id} itemsLength={items.length} />
              </List.Item>
            )}
          />
        </LoadingWrapper>
      </div>
    </div>
  );
};

export default OrderList;
