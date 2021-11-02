import { transformOrderProductData } from "./helper";

describe("transformOrderProductData helper function", () => {
  const product = {
    id: "A101",
    description: "Screwdriver",
    category: "1",
    price: "9.75",
  };

  it("should transform price to number", () => {
    expect(typeof transformOrderProductData(product).price).toEqual("number");
  });

  it("should not change values", () => {
    const transformedProduct = {
      id: "A101",
      description: "Screwdriver",
      category: "1",
      price: 9.75,
    };

    expect(transformOrderProductData(product)).toEqual(transformedProduct);
  });
});
