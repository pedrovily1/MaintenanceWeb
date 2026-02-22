import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Tailwind lives here
import { App } from "./App";

// Note: StrictMode disabled to prevent double token consumption during auth flows
// Supabase's detectSessionInUrl runs on mount and consumes single-use tokens
// StrictMode's double-mount in dev would consume the token twice, causing otp_expired errors
ReactDOM.createRoot(document.getElementById("app")!).render(
    <App />
);
