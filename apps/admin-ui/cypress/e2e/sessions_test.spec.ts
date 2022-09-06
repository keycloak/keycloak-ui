import LoginPage from "../support/pages/LoginPage";
import SidebarPage from "../support/pages/admin_console/SidebarPage";
import SessionsPage from "../support/pages/admin_console/manage/sessions/SessionsPage";
import CommonPage from "../support/pages/CommonPage";
import { keycloakBefore } from "../support/util/keycloak_hooks";

const loginPage = new LoginPage();
const sidebarPage = new SidebarPage();
const sessionsPage = new SessionsPage();
const commonPage = new CommonPage();

describe("Sessions test", () => {
  const admin = "admin";
  const client = "security-admin-console-v2";
  beforeEach(() => {
    keycloakBefore();
    loginPage.logIn();
    sidebarPage.goToSessions();
  });

  describe("Sessions list view", () => {
    it("check item values", () => {
      commonPage
        .tableUtils()
        .checkRowItemExists(admin)
        .checkRowItemExists(client);
    });

    it("go to item accessed clients link", () => {
      commonPage.tableUtils().clickRowItemLink(client);
    });
  });

  describe("revocation", () => {
    it("Set revocation notBefore", () => {
      sessionsPage.setToNow();
    });

    it("Check if notBefore saved", () => {
      sessionsPage.checkNotBeforeValueExists();
    });

    it("Clear revocation notBefore", () => {
      sessionsPage.clearNotBefore();
    });

    it("Check if notBefore cleared", () => {
      sessionsPage.checkNotBeforeCleared();
    });
  });

  describe("logout all sessions", () => {
    it("logout all sessions", () => {
      sessionsPage.logoutAllSessions();
      cy.get("#kc-page-title").contains("Sign in to your account");
    });
  });
});
