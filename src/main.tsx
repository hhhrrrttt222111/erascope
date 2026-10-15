import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./theme/fonts.css";
import { EraProvider } from "./context/EraContext";
import App from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EraProvider>
      <App />
    </EraProvider>
  </StrictMode>,
);
