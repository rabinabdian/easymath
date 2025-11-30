import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ChildSettingsProvider } from "./context/ChildSettingsContext";
import { I18nProvider } from "./i18n";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <I18nProvider>
      <ChildSettingsProvider>
        <HashRouter>
          <App />
        </HashRouter>
      </ChildSettingsProvider>
    </I18nProvider>
  </React.StrictMode>
);
