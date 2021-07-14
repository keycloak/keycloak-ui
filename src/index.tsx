import React, { StrictMode } from "react";
import ReactDOM from "react-dom";
import i18n from "./i18n";

import init from "./context/auth/keycloak";
import { KeycloakAdminConsole } from "./KeycloakAdminConsole";

console.info("supported languages", ...i18n.languages);

init().then((adminClient) => {
  ReactDOM.render(
    <StrictMode>
      <KeycloakAdminConsole adminClient={adminClient} />
    </StrictMode>,
    document.getElementById("app")
  );
});
