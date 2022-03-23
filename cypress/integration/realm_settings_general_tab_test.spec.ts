import SidebarPage from "../support/pages/admin_console/SidebarPage";
import LoginPage from "../support/pages/LoginPage";
import RealmSettingsPage from "../support/pages/admin_console/manage/realm_settings/RealmSettingsPage";
import Masthead from "../support/pages/admin_console/Masthead";
import { keycloakBefore } from "../support/util/keycloak_hooks";
import adminClient from "../support/util/AdminClient";

const loginPage = new LoginPage();
const sidebarPage = new SidebarPage();
const masthead = new Masthead();
const realmSettingsPage = new RealmSettingsPage();

describe("Realm settings general tab tests", () => {
  const realmName = "Realm_" + (Math.random() + 1).toString(36).substring(7);

  beforeEach(() => {
    keycloakBefore();
    loginPage.logIn();
    sidebarPage.goToRealm(realmName);
  });

  before(async () => {
    await adminClient.createRealm(realmName);
  });

  after(async () => {
    await adminClient.deleteRealm(realmName);
  });

  it.skip("Test all general tab switches", () => {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.toggleSwitch(realmSettingsPage.managedAccessSwitch);
    realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
    masthead.checkNotificationMessage("Realm successfully updated", true);
    realmSettingsPage.toggleSwitch(realmSettingsPage.managedAccessSwitch);
    realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
    masthead.checkNotificationMessage("Realm successfully updated", true);

    // Enable realm
    realmSettingsPage.toggleSwitch(`${realmName}-switch`);
    masthead.checkNotificationMessage("Realm successfully updated", true);
    cy.findByTestId(`${realmName}-switch`).should("have.value", "on");

    // Disable realm
    realmSettingsPage.toggleSwitch(`${realmName}-switch`);
    realmSettingsPage.disableRealm();
    masthead.checkNotificationMessage("Realm successfully updated", true);
    cy.findByTestId(`${realmName}-switch`).should("have.value", "off");

    // Re-enable realm
    realmSettingsPage.toggleSwitch(`${realmName}-switch`);
    masthead.checkNotificationMessage("Realm successfully updated");
    cy.findByTestId(`${realmName}-switch`).should("have.value", "on");
  });

  it("Modify Display name", () => {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.fillDisplayName("display_name");
    realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
    masthead.checkNotificationMessage("Realm successfully updated", true);
  });

  it("Check Display name value", () => {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.getDisplayName("display_name");
  });

  it("Modify front end URL", () => {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.fillFrontendURL("www.example.com");
    realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
    masthead.checkNotificationMessage("Realm successfully updated", true);
  });

  it("Check front end display name value", () => {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.getFrontendURL("www.example.com");
  });

  it("Select SSL all requests", () => {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.fillRequireSSL("All requests");
    realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
    masthead.checkNotificationMessage("Realm successfully updated", true);
  });

  it("Check SSL all requests", () => {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.getRequireSSL("All requests");
  });

  it("Select SSL external requests", () => {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.fillRequireSSL("External requests");
    realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
    masthead.checkNotificationMessage("Realm successfully updated", true);
  });

  it("Check SSL external requests", () => {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.getRequireSSL("External requests");
  });

  it("Select SSL None", () => {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.fillRequireSSL("None");
    realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
    masthead.checkNotificationMessage("Realm successfully updated", true);
  });

  it("Check SSL None", () => {
    sidebarPage.goToRealmSettings();
    realmSettingsPage.getRequireSSL("None");
  });
});
