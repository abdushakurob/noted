import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import App from "./App";
import { bootstrapNoted } from "./noted-bootstrap";

bootstrapNoted();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
