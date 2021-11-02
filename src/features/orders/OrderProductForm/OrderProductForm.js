import React from "react";
import { Card, Form, Input, Button, InputNumber } from "antd";

const OrderProductForm = ({ addProductAction }) => {
  const [form] = Form.useForm();
  const onFinish = (product) => {
    addProductAction(product);
    form.resetFields();
  };
  return (
    <Card title="Add new order product">
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onFinish={onFinish}
      >
        <Form.Item
          label="Product ID"
          name="productId"
          rules={[{ required: true, message: "Please input the product Id!" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Quantity"
          name="quantity"
          rules={[{ required: true, message: "Please input the quantity!" }]}
        >
          <InputNumber min={1} style={{ width: "100%" }} />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit">
            Add Product
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default OrderProductForm;
