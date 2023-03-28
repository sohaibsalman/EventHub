import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";

import { store, StoreContext } from "./app/stores/store";
import { router } from "./app/router/Routes";

import "semantic-ui-css/semantic.min.css";
import "./app/layout/styles.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <StoreContext.Provider value={store}>
    <RouterProvider router={router} />
  </StoreContext.Provider>
);
