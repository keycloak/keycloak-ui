import LoginPage from "./../support/pages/LoginPage.js";
import Masthead from "./../support/pages/admin_console/Masthead.js";

describe("Logging In", function () {
  const username = "admin";
  const password = "admin";

  const loginPage = new LoginPage();
  const masthead = new Masthead();

  beforeEach(function () {
    cy.visit("");
  });

  it("displays errors on wrong credentials", function () {
    loginPage
      .logIn("wrong", "user{enter}")
      .checkErrorMessage("Invalid username or password.")
      .isLogInPage();
  });

  it("logs in", function () {
    loginPage.logIn(username, password);

    masthead.isAdminConsole();

    cy.getCookie("KEYCLOAK_SESSION_LEGACY").should("exist");
  });
});
