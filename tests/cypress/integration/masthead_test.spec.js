import ListingPage from "../support/pages/admin_console/ListingPage.js";
import LoginPage from "../support/pages/LoginPage.js";
import SidebarPage from "../support/pages/admin_console/SidebarPage.js";

const loginPage = new LoginPage();

const logOutTest = (userDropdown) => {
  it("logs out", () => {
    cy.get(userDropdown).click();
    cy.get("#sign-out").click();
    loginPage.isLogInPage();
  });
};

const goToAcctMgtTest = (userDropdown) => {
  it("opens manage account and returns to admin console", () => {
    cy.get(userDropdown).click();
    cy.get("#manage-account").click();
    cy.contains("Welcome to Keycloak Account Management");
    cy.get("#landingReferrerLink").click({ force: true });
    cy.get(userDropdown);
  });
};

describe("Masthead tests", () => {
  beforeEach(() => {
    cy.visit("");
    loginPage.logIn();
  });

  goToAcctMgtTest("#user-dropdown");

  it("disables header help and form field help", () => {
    const sidebarPage = new SidebarPage();
    const listingPage = new ListingPage();

    sidebarPage.goToClientScopes();
    listingPage.goToItemDetails("address");

    cy.get("#view-header-subkey").should("exist");
    cy.get(`#${CSS.escape("client-scopes-help:name")}`).should("exist");

    cy.get("#help").click();
    cy.get("#enableHelp").click({ force: true });

    cy.get("#view-header-subkey").should("not.exist");
    cy.get(`#${CSS.escape("client-scopes-help:name")}`).should("not.exist");
  });

  logOutTest("#user-dropdown");
});

describe("Masthead tests with kebab menu", () => {
  beforeEach(() => {
    cy.viewport("iphone-6");
    cy.visit("");
    loginPage.logIn();
  });

  it("shows kabab and hides regular menu", () => {
    cy.get("#user-dropdown").should("not.exist");
    cy.get("#user-dropdown-kebab").should("exist");
  });

  // TODO: Add test for help when using kebab menu.
  //       Feature not yet implemented for kebab.

  goToAcctMgtTest("#user-dropdown-kebab");
  logOutTest("#user-dropdown-kebab");
});
