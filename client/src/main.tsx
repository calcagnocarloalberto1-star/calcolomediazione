import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// Redirect hash URLs to clean paths (backwards compatibility)
if (window.location.hash && window.location.hash.startsWith('#/')) {
  const path = window.location.hash.slice(1); // remove #
  window.history.replaceState(null, '', path);
}

createRoot(document.getElementById("root")!).render(<App />);
