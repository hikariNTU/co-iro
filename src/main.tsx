import { createRoot } from "react-dom/client";
import { App } from "./app";
import "./styles/index.css";

const container = document.getElementById("🌈");
if (!container) {
  alert("Is javascript disabled?");
} else {
  const root = createRoot(container);
  root.render(<App />);
}
