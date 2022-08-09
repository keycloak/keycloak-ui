import "@patternfly/patternfly/patternfly-addons.css";
import "@patternfly/react-core/dist/styles/base.css";

import { StrictMode } from "react";
import ReactDOM from "react-dom";

import { AdminClientProps, App } from "./App";
import { AppError } from "./AppError";
import { initAdminClient } from "./context/auth/AdminClient";
import { initI18n } from "./i18n";

import "./index.css";

const root = document.getElementById("app");

async function initialize() {
  try {
    const { keycloak, adminClient } = await initAdminClient();

    await initI18n(adminClient);
    renderApp({ keycloak, adminClient });
  } catch (err) {
    renderError();
  }
}

function renderApp(props: AdminClientProps) {
  ReactDOM.render(
    <StrictMode>
      <App {...props} />
    </StrictMode>,
    root
  );
}

function renderError() {
  ReactDOM.render(
    <StrictMode>
      <AppError />
    </StrictMode>,
    root
  );
}

initialize();
