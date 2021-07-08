import "./index.css";
import React from "react";
import ReactDOM from "react-dom";
import i18n from "./i18n";

import init from "./context/auth/keycloak";
import { KeycloakAdminConsole } from "./KeycloakAdminConsole";

console.info("supported languages", ...i18n.languages);

init().then((adminClient) => {
  ReactDOM.render(
    <React.StrictMode>
      <KeycloakAdminConsole adminClient={adminClient} />
    </React.StrictMode>,
    document.getElementById("app")
  );
});

// Hot Module Replacement (HMR) - Remove this snippet to remove HMR.
// Learn more: https://snowpack.dev/concepts/hot-module-replacement
if (import.meta.hot) {
  import.meta.hot.accept();
}
