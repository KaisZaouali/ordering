import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import routes from "./app/routes";
import "./App.css";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path={routes.orderList.path}
            component={routes.orderList.component}
          />
          <Route
            exact
            path={routes.orderDetails.path}
            component={routes.orderDetails.component}
          />
          <Route
            path="*"
            render={() => <Redirect to={routes.orderList.path} />}
          />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
