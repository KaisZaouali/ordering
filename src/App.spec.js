import React from "react";
import { shallow } from "enzyme";
import App from "./App";

describe("App Component", () => {
  let container;
  beforeEach(() => (container = shallow(<App />)));

  it("should component be rendering ", () => {
    expect(container.find("div").length).toEqual(1);
  });
});
