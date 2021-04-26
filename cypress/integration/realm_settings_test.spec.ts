import SidebarPage from "../support/pages/admin_console/SidebarPage";
import LoginPage from "../support/pages/LoginPage";
import RealmSettingsPage from "../support/pages/admin_console/manage/realm_settings/RealmSettingsPage";
import { keycloakBefore } from "../support/util/keycloak_before";

describe("Realm settings test", () => {
  const loginPage = new LoginPage();
  const sidebarPage = new SidebarPage();
  const realmSettingsPage = new RealmSettingsPage();

  // const managedAccessSwitch = "user-managed-access-switch";
  // const userRegSwitch = "user-reg-switch";
  // const forgotPwdSwitch = "forgot-pw-switch";
  // const rememberMeSwitch = "remember-me-switch";
  // const verifyEmailSwitch = "verify-email-switch";

  let itemId = "user_crud";

  describe("Realm settings", function () {
    beforeEach(function () {
      keycloakBefore();
      loginPage.logIn();
    });

    it("Go to general tab", function () {
      sidebarPage.goToRealmSettings();
      realmSettingsPage.toggleSwitch(realmSettingsPage.managedAccessSwitch);
      realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
      realmSettingsPage.toggleSwitch(realmSettingsPage.managedAccessSwitch);
      realmSettingsPage.save(realmSettingsPage.generalSaveBtn);
    });

    it("Go to login tab", function () {
      sidebarPage.goToRealmSettings();
      cy.getId("rs-login-tab").click();
      realmSettingsPage.toggleSwitch(realmSettingsPage.userRegSwitch);
      realmSettingsPage.toggleSwitch(realmSettingsPage.forgotPwdSwitch);
      realmSettingsPage.toggleSwitch(realmSettingsPage.rememberMeSwitch);
      realmSettingsPage.toggleSwitch(realmSettingsPage.verifyEmailSwitch);
    });

    it("Go to email tab", function () {
      sidebarPage.goToRealmSettings();
      cy.getId("rs-email-tab").click();

      realmSettingsPage.addSenderEmail("example@example.com");

      cy.wait(100)

      realmSettingsPage.toggleCheck(realmSettingsPage.enableSslCheck);
      realmSettingsPage.toggleCheck(realmSettingsPage.enableStartTlsCheck);

      realmSettingsPage.save(realmSettingsPage.emailSaveBtn);
    });

    it("Go to themes tab", function () {
      sidebarPage.goToRealmSettings();
      cy.getId("rs-themes-tab").click();
      realmSettingsPage.selectLoginThemeType("keycloak");
      realmSettingsPage.selectAccountThemeType("keycloak");
      realmSettingsPage.selectAdminThemeType("base");
      realmSettingsPage.selectEmailThemeType("base");

      realmSettingsPage.saveThemes();
    });
  });
});
