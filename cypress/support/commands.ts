// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

Cypress.Commands.add("getId", (selector, ...args) => {
  return cy.get(`[data-testid="${selector}"]`, ...args);
});

declare namespace Cypress {
  interface Chainable<Subject> {
    /**
     * Get one or more DOM elements by `data-testid`.
     *
     * @example
     * cy.getId('searchButton')  // Gets the <button data-testid="searchButton">Search</button>
     */
    getId(selector: string, ...args): Chainable<any>;
  }
}
