import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./theme/fonts.css";
import { EraProvider } from "./context/EraContext";
import App from "./App";

// After a redeploy, a tab still running the old build asks for chunk files that no longer exist
// (e.g. the Deep Dive view). Vite reports that here; reload once so the tab picks up the new build.
// The URL hash survives the reload, so the user lands back on the same page.
window.addEventListener("vite:preloadError", (event) => {
  event.preventDefault();
  try {
    if (window.sessionStorage.getItem("erascope:chunk-reload") === "1") return;
    window.sessionStorage.setItem("erascope:chunk-reload", "1");
  } catch {
    // No storage: reload anyway; a loop is impossible because the fresh build has the chunks.
  }
  window.location.reload();
});

// A page that has stayed up for 10s is healthy, so a later redeploy may reload again.
window.setTimeout(() => {
  try {
    window.sessionStorage.removeItem("erascope:chunk-reload");
  } catch {
    // Storage unavailable: nothing to clear.
  }
}, 10000);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <EraProvider>
      <App />
    </EraProvider>
  </StrictMode>,
);
