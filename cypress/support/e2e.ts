// ***********************************************************
// This example support/index.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import "./commands";
import "cypress-axe";

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Set Keycloak server to development path if not set.
if (!Cypress.env("KEYCLOAK_SERVER")) {
  Cypress.env("KEYCLOAK_SERVER", "http://localhost:8180");
}

// Always preserve session related cookies.
Cypress.Cookies.defaults({
  preserve: isSessionCookie,
});

function isSessionCookie({ name }: Cypress.Cookie) {
  return name.startsWith("KEYCLOAK_") || name.startsWith("AUTH_SESSION_");
}
