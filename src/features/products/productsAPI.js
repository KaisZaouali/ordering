import axios from "axios";
import { baseApiUrl, productServices } from "../../services";

export const getProductDetailsAsync = async (productId) => {
  const result = await axios.get(
    baseApiUrl + productServices.getProductDetails(productId)
  );
  return result.data;
};
