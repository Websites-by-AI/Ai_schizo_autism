import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App";
import { MotionConfig } from "framer-motion";
import { IntegrationsProvider } from "./components/IntegrationsProvider";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <MotionConfig reducedMotion="user">
      <IntegrationsProvider><App /></IntegrationsProvider>
    </MotionConfig>
  </StrictMode>
);
