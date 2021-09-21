import SidebarPage from "../support/pages/admin_console/SidebarPage";
import LoginPage from "../support/pages/LoginPage";
import RealmSettingsPage from "../support/pages/admin_console/manage/realm_settings/RealmSettingsPage";
import Masthead from "../support/pages/admin_console/Masthead";
import ModalUtils from "../support/util/ModalUtils";
import { keycloakBefore } from "../support/util/keycloak_before";
import AdminClient from "../support/util/AdminClient";
import ListingPage from "../support/pages/admin_console/ListingPage";

const loginPage = new LoginPage();
const sidebarPage = new SidebarPage();
const masthead = new Masthead();
const modalUtils = new ModalUtils();
const realmSettingsPage = new RealmSettingsPage();

describe("Realm settings", () => {
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

  const goToKeys = () => {
    const keysUrl = `/auth/admin/realms/${realmName}/keys`;
    cy.intercept(keysUrl).as("keysFetch");
    cy.findByTestId("rs-keys-tab").click();
    cy.findByTestId("rs-keys-list-tab").click();
    cy.wait(["@keysFetch"]);

    return this;
  };

  const goToDetails = () => {
    const keysUrl = `/auth/admin/realms/${realmName}/keys`;
    cy.intercept(keysUrl).as("keysFetch");

    cy.findByTestId("rs-keys-tab").click();
    cy.findByTestId("rs-providers-tab").click();
    cy.findAllByTestId("provider-name-link")
      .contains("test_aes-generated")
      .click();

    sidebarPage.goToRealmSettings();

    cy.findByTestId("rs-keys-tab").click();
    cy.findByTestId("rs-providers-tab").click();
    cy.findAllByTestId("provider-name-link")
      .contains("test_hmac-generated")
      .click();

    sidebarPage.goToRealmSettings();

    cy.findByTestId("rs-keys-tab").click();
    cy.findByTestId("rs-providers-tab").click();
    cy.findAllByTestId("provider-name-link").contains("test_rsa").click();

    sidebarPage.goToRealmSettings();

    cy.findByTestId("rs-keys-tab").click();
    cy.findByTestId("rs-providers-tab").click();
    cy.findAllByTestId("provider-name-link")
      .contains("test_rsa-generated")
      .click();

    cy.wait(["@keysFetch"]);

    return this;
  };

  /*const deleteProvider = (providerName: string) => {
    const url = `/auth/admin/realms/${realmName}/users/*`;
    cy.intercept(url).as("reload");
    cy.findByTestId("provider-name")
      .contains(providerName)
      .parentsUntil(".pf-c-data-list__item-row")
      .find(".pf-c-dropdown__toggle")
      .click()
      .findByTestId(realmSettingsPage.deleteAction)
      .click();
    cy.findByTestId(realmSettingsPage.modalConfirm).click();

    cy.wait(["@reload"]);
    return this;
  };*/

  const addBundle = () => {
    const localizationUrl = `/auth/admin/realms/${realmName}/localization/en`;
    cy.intercept(localizationUrl).as("localizationFetch");

    realmSettingsPage.addKeyValuePair(
      "key_" + (Math.random() + 1).toString(36).substring(7),
      "value_" + (Math.random() + 1).toString(36).substring(7)
    );

    cy.wait(["@localizationFetch"]);

    return this;
  };

  it("Go to general tab", function () {
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

  describe("Events tab", () => {
    const listingPage = new ListingPage();

    it("Enable user events", () => {
      cy.intercept("GET", `/auth/admin/realms/${realmName}/keys`).as("load");
      sidebarPage.goToRealmSettings();
      cy.findByTestId("rs-realm-events-tab").click();
      cy.wait(["@load"]);

      realmSettingsPage
        .toggleSwitch(realmSettingsPage.enableEvents)
        .save(realmSettingsPage.eventsUserSave);
      masthead.checkNotificationMessage("Successfully saved configuration");

      realmSettingsPage.clearEvents("user");

      modalUtils
        .checkModalMessage(
          "If you clear all events of this realm, all records will be permanently cleared in the database"
        )
        .confirmModal();

      masthead.checkNotificationMessage("The user events have been cleared");

      const events = ["Client info", "Client info error"];

      cy.intercept("GET", `/auth/admin/realms/${realmName}/events/config`).as(
        "fetchConfig"
      );
      realmSettingsPage.addUserEvents(events).clickAdd();
      masthead.checkNotificationMessage("Successfully saved configuration");
      cy.wait(["@fetchConfig"]);
      sidebarPage.waitForPageLoad();

      for (const event of events) {
        listingPage.searchItem(event, false).itemExist(event);
      }
    });
  });

  it("Go to keys tab", () => {
    sidebarPage.goToRealmSettings();

    cy.findByTestId("rs-keys-tab").click();
  });

  it("add Providers", () => {
    sidebarPage.goToRealmSettings();

    cy.findByTestId("rs-keys-tab").click();

    cy.findByTestId("rs-providers-tab").click();

    realmSettingsPage.toggleAddProviderDropdown();

    cy.findByTestId("option-aes-generated").click();
    realmSettingsPage.enterConsoleDisplayName("test_aes-generated");
    realmSettingsPage.addProvider();

    realmSettingsPage.toggleAddProviderDropdown();

    cy.findByTestId("option-ecdsa-generated").click();
    realmSettingsPage.enterConsoleDisplayName("test_ecdsa-generated");
    realmSettingsPage.addProvider();

    realmSettingsPage.toggleAddProviderDropdown();

    cy.findByTestId("option-hmac-generated").click();
    realmSettingsPage.enterConsoleDisplayName("test_hmac-generated");
    realmSettingsPage.addProvider();

    realmSettingsPage.toggleAddProviderDropdown();

    cy.findByTestId("option-rsa-generated").click();
    realmSettingsPage.enterConsoleDisplayName("test_rsa-generated");
    realmSettingsPage.addProvider();
  });

  it("go to details", () => {
    sidebarPage.goToRealmSettings();
    goToDetails();
  });

  /*it("delete providers", () => {
    sidebarPage.goToRealmSettings();
    const url = `/auth/admin/realms/${realmName}/keys`;
    cy.intercept(url).as("load");

    cy.findByTestId("rs-keys-tab").click();
    cy.findByTestId("rs-providers-tab").click();

    cy.wait("@load");

    deleteProvider("test_aes-generated");
    deleteProvider("test_ecdsa-generated");
    deleteProvider("test_hmac-generated");
    deleteProvider("test_rsa-generated");
  });*/
  it("Test keys", () => {
    sidebarPage.goToRealmSettings();
    goToKeys();

    realmSettingsPage.testSelectFilter();
  });

  it("add locale", () => {
    sidebarPage.goToRealmSettings();

    cy.findByTestId("rs-localization-tab").click();

    addBundle();

    masthead.checkNotificationMessage(
      "Success! The localization text has been created."
    );
  });

  it("Realm header settings", () => {
    sidebarPage.goToRealmSettings();
    cy.get("#pf-tab-securityDefences-securityDefences").click();
    cy.findByTestId("headers-form-tab-save").should("be.disabled");
    cy.get("#xFrameOptions").clear().type("DENY");
    cy.findByTestId("headers-form-tab-save").should("be.enabled").click();

    masthead.checkNotificationMessage("Realm successfully updated");
  });

  it("add session data", () => {
    sidebarPage.goToRealmSettings();

    cy.findByTestId("rs-sessions-tab").click();

    realmSettingsPage.populateSessionsPage();
    realmSettingsPage.save("sessions-tab-save");

    masthead.checkNotificationMessage("Realm successfully updated");
  });

  it("check that sessions data was saved", () => {
    sidebarPage.goToAuthentication();
    sidebarPage.goToRealmSettings();

    cy.findByTestId("rs-sessions-tab").click();

    cy.findByTestId(realmSettingsPage.ssoSessionIdleInput).should(
      "have.value",
      1
    );
    cy.findByTestId(realmSettingsPage.ssoSessionMaxInput).should(
      "have.value",
      2
    );
    cy.findByTestId(realmSettingsPage.ssoSessionIdleRememberMeInput).should(
      "have.value",
      3
    );
    cy.findByTestId(realmSettingsPage.ssoSessionMaxRememberMeInput).should(
      "have.value",
      4
    );

    cy.findByTestId(realmSettingsPage.clientSessionIdleInput).should(
      "have.value",
      5
    );
    cy.findByTestId(realmSettingsPage.clientSessionMaxInput).should(
      "have.value",
      6
    );

    cy.findByTestId(realmSettingsPage.offlineSessionIdleInput).should(
      "have.value",
      7
    );
    cy.findByTestId(realmSettingsPage.offlineSessionMaxSwitch).should(
      "have.value",
      "on"
    );

    cy.findByTestId(realmSettingsPage.loginTimeoutInput).should(
      "have.value",
      9
    );
    cy.findByTestId(realmSettingsPage.loginActionTimeoutInput).should(
      "have.value",
      10
    );
  });

  it("add token data", () => {
    sidebarPage.goToRealmSettings();

    cy.findByTestId("rs-tokens-tab").click();

    realmSettingsPage.populateTokensPage();
    realmSettingsPage.save("tokens-tab-save");

    masthead.checkNotificationMessage("Realm successfully updated");
  });

  it("check that token data was saved", () => {
    sidebarPage.goToRealmSettings();

    cy.findByTestId("rs-tokens-tab").click();

    cy.findByTestId(realmSettingsPage.accessTokenLifespanInput).should(
      "have.value",
      1
    );
    cy.findByTestId(realmSettingsPage.accessTokenLifespanImplicitInput).should(
      "have.value",
      2
    );
    cy.findByTestId(realmSettingsPage.clientLoginTimeoutInput).should(
      "have.value",
      3
    );
    cy.findByTestId(realmSettingsPage.userInitiatedActionLifespanInput).should(
      "have.value",
      4
    );

    cy.findByTestId(realmSettingsPage.defaultAdminInitatedInput).should(
      "have.value",
      5
    );
    cy.findByTestId(realmSettingsPage.emailVerificationInput).should(
      "have.value",
      6
    );

    cy.findByTestId(realmSettingsPage.idpEmailVerificationInput).should(
      "have.value",
      7
    );
    cy.findByTestId(realmSettingsPage.forgotPasswordInput).should(
      "have.value",
      8
    );

    cy.findByTestId(realmSettingsPage.executeActionsInput).should(
      "have.value",
      9
    );
  });
});
