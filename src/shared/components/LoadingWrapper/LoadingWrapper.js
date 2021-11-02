import React from "react";
import { Skeleton } from "antd";

const LoadingWrapper = ({ loading, children }) => {
  if (loading) return <Skeleton />;
  return <React.Fragment>{children}</React.Fragment>;
};

export default LoadingWrapper;
