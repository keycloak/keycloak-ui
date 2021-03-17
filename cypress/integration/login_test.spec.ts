import LoginPage from "../support/pages/LoginPage";
import Masthead from "../support/pages/admin_console/Masthead";
import { keycloakBefore } from "../support/util/keycloak_before";

const username = "admin";
const password = "admin";

const loginPage = new LoginPage();
const masthead = new Masthead();

describe("Logging In", function () {
  beforeEach(function () {
    keycloakBefore();
  });

  it("displays errors on wrong credentials", function () {
    loginPage.logIn("wrong", "user{enter}");

    loginPage.checkErrorMessage("Invalid username or password.").isLogInPage();
  });

  it("logs in", function () {
    loginPage.logIn(username, password);

    masthead.isAdminConsole();

    cy.getCookie("KEYCLOAK_SESSION_LEGACY").should("exist");
  });
});
