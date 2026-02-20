import "../tailwind.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("app")!).render(
  <React.StrictMode>
    {/* StrictMode intentionally runs components twice in development to help
        detect impure renders and missing cleanup in effects. This does NOT
        affect production builds. To disable during debugging, replace
        <React.StrictMode> with a <> fragment. */}
    <App />
  </React.StrictMode>,
);
