import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Card, Button, Divider } from "antd";
import styles from "./OrderProduct.module.css";
import {
  getProductDetails,
  selectProductsStore,
} from "../../products/productsSlice";

const OrderProduct = ({ orderProduct, deleteProductAction }) => {
  const { productId, total, quantity } = orderProduct;
  const { products, loading } = useSelector(selectProductsStore);
  const { getProductDetailsLoading } = loading;
  const dispatch = useDispatch();
  const isProductDataFetched = !!products[productId];

  useEffect(() => {
    /* fetch product if it's not already fetched within previous actions */
    if (!isProductDataFetched) dispatch(getProductDetails(productId));
  }, [dispatch, isProductDataFetched, productId]);

  const DeleteProductComponent = () => (
    <Button onClick={() => deleteProductAction(productId)}>Delete</Button>
  );

  return (
    <div className={styles.orderProduct}>
      <Card
        title={productId}
        loading={getProductDetailsLoading && !isProductDataFetched}
        extra={<DeleteProductComponent />}
      >
        <div>{`Total: ${total}`}</div>
        <div>{`Quantity: ${quantity}`}</div>
        {isProductDataFetched && (
          <OrderProductContent {...products[productId]} />
        )}
      </Card>
    </div>
  );
};

const OrderProductContent = React.memo(({ description, category, price }) => (
  <React.Fragment>
    <Divider />
    <div>{`Description: ${description}`}</div>
    <div>{`Category: ${category}`}</div>
    <div>{`Price: ${price}`}</div>
  </React.Fragment>
));

export default OrderProduct;
