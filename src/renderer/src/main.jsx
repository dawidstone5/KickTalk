import "./assets/styles/main.scss";

import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";

// HashRouter — file:// pages can't use BrowserRouter in production builds.
ReactDOM.createRoot(document.getElementById("root")).render(
  <HashRouter>
    <App />
  </HashRouter>,
);
