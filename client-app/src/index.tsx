import ReactDOM from "react-dom/client";

import App from "./app/layout/App";

import "semantic-ui-css/semantic.min.css";
import "./app/layout/styles.css";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(<App />);
