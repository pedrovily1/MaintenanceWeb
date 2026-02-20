import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Tailwind lives here
import { App } from "./App";

ReactDOM.createRoot(document.getElementById("app")!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);