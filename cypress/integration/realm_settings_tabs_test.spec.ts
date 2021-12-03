import SidebarPage from "../support/pages/admin_console/SidebarPage";
import LoginPage from "../support/pages/LoginPage";
import RealmSettingsPage from "../support/pages/admin_console/manage/realm_settings/RealmSettingsPage";
import Masthead from "../support/pages/admin_console/Masthead";
import { keycloakBefore } from "../support/util/keycloak_before";
import AdminClient from "../support/util/AdminClient";

const loginPage = new LoginPage();
const sidebarPage = new SidebarPage();
const masthead = new Masthead();
const realmSettingsPage = new RealmSettingsPage();

describe("Realm settings tabs tests", () => {
  const realmName = "Realm_" + (Math.random() + 1).toString(36).substring(7);

  beforeEach(() => {
    keycloakBefore();
    loginPage.logIn();
    sidebarPage.goToRealm(realmName);
  });

  before(async () => {
    await new AdminClient().createRealm(realmName);
  });

  after(async () => {
    await new AdminClient().deleteRealm(realmName);
  });

  it("Go to general tab", () => {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.toggleSwitch(realmSettingsPage.managedAccessSwitch);
    realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
    masthead.checkNotificationMessage("Realm successfully updated");
    realmSettingsPage.toggleSwitch(realmSettingsPage.managedAccessSwitch);
    realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
    masthead.checkNotificationMessage("Realm successfully updated");
  });

  it("Go to login tab", () => {
    sidebarPage.goToRealmSettings();
    cy.findByTestId("rs-login-tab").click();
    realmSettingsPage.toggleSwitch(realmSettingsPage.userRegSwitch);
    realmSettingsPage.toggleSwitch(realmSettingsPage.forgotPwdSwitch);
    realmSettingsPage.toggleSwitch(realmSettingsPage.rememberMeSwitch);
  });

  it("Check login tab values", () => {
    sidebarPage.goToRealmSettings();
    cy.findByTestId("rs-login-tab").click();

    cy.get("#kc-user-reg-switch-off").should("be.visible");
    cy.get("#kc-forgot-pw-switch-off").should("be.visible");
    cy.get("#kc-remember-me-switch-off").should("not.be.visible");
  });

  it("Go to email tab", () => {
    sidebarPage.goToRealmSettings();
    cy.findByTestId("rs-email-tab").click();
    realmSettingsPage.addSenderEmail("example@example.com");
    realmSettingsPage.toggleCheck(realmSettingsPage.enableSslCheck);
    realmSettingsPage.toggleCheck(realmSettingsPage.enableStartTlsCheck);
    realmSettingsPage.save(realmSettingsPage.emailSaveBtn);
    realmSettingsPage.fillHostField("localhost");
    cy.findByTestId(realmSettingsPage.testConnectionButton).click();

    realmSettingsPage.fillEmailField(
      "example" + (Math.random() + 1).toString(36).substring(7) + "@example.com"
    );
    cy.findByTestId(realmSettingsPage.modalTestConnectionButton).click();

    masthead.checkNotificationMessage("Error! Failed to send email.");
  });

  it("Go to themes tab", () => {
    sidebarPage.goToRealmSettings();
    cy.intercept(`/auth/admin/realms/${realmName}/keys`).as("load");

    cy.findByTestId("rs-themes-tab").click();
    cy.wait(["@load"]);

    realmSettingsPage.selectLoginThemeType("keycloak");
    realmSettingsPage.selectAccountThemeType("keycloak");
    realmSettingsPage.selectAdminThemeType("base");
    realmSettingsPage.selectEmailThemeType("base");

    realmSettingsPage.saveThemes();
  });
});
