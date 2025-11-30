import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ChildSettingsProvider } from "./context/ChildSettingsContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChildSettingsProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ChildSettingsProvider>
  </React.StrictMode>
);
