import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";

const root = document.getElementById("root");
const appRoot = createRoot(root);

appRoot.render(
  <AuthProvider>
    <App />
  </AuthProvider>
);
