import React from "react";
import { Typography } from "antd";

const OrderTitle = ({ total, id, itemsLength }) => {
  return (
    <div>
      <Typography.Text mark>[{id}]</Typography.Text>
      {` - Number of products: ${itemsLength} - `}
      {`Total: ${total}`}
    </div>
  );
};

export default React.memo(OrderTitle);
