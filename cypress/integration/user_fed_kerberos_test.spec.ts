import LoginPage from "../support/pages/LoginPage";
import SidebarPage from "../support/pages/admin_console/SidebarPage";
import ProviderPage from "../support/pages/admin_console/manage/providers/ProviderPage";
import Masthead from "../support/pages/admin_console/Masthead";
import ModalUtils from "../support/util/ModalUtils";
import { keycloakBefore } from "../support/util/keycloak_hooks";
import PriorityDialog from "../support/pages/admin_console/manage/providers/PriorityDialog";

const loginPage = new LoginPage();
const masthead = new Masthead();
const sidebarPage = new SidebarPage();
const providersPage = new ProviderPage();
const modalUtils = new ModalUtils();

const provider = "kerberos";
const initCapProvider = provider.charAt(0).toUpperCase() + provider.slice(1);

const kerberosName = "my-kerberos";
const kerberosRealm = "my-realm";
const kerberosPrincipal = "my-principal";
const kerberosKeytab = "my-keytab";

const firstKerberosName = `${kerberosName}-1`;
const firstKerberosRealm = `${kerberosRealm}-1`;
const firstKerberosPrincipal = `${kerberosPrincipal}-1`;
const firstKerberosKeytab = `${kerberosKeytab}-1`;

const secondKerberosName = `${kerberosName}-2`;
const secondKerberosRealm = `${kerberosRealm}-2`;
const secondKerberosPrincipal = `${kerberosPrincipal}-2`;
const secondKerberosKeytab = `${kerberosKeytab}-2`;

const thirdKerberosName = `${kerberosName}-3`;
const thirdKerberosRealm = `${kerberosRealm}-3`;
const thirdKerberosPrincipal = `${kerberosPrincipal}-3`;
const thirdKerberosKeytab = `${kerberosKeytab}-3`;

const defaultPolicy = "DEFAULT";
const newPolicy = "EVICT_WEEKLY";
const defaultKerberosDay = "Sunday";
const defaultKerberosHour = "00";
const defaultKerberosMinute = "00";
const newKerberosDay = "Wednesday";
const newKerberosHour = "15";
const newKerberosMinute = "55";

const addProviderMenu = "Add new provider";
const createdSuccessMessage = "User federation provider successfully created";
const savedSuccessMessage = "User federation provider successfully saved";
const deletedSuccessMessage = "The user federation provider has been deleted.";
const deleteModalTitle = "Delete user federation provider?";
const disableModalTitle = "Disable user federation provider?";
const changeSuccessMsg =
  "Successfully changed the priority order of user federation providers";

describe("User Fed Kerberos tests", () => {
  beforeEach(() => {
    keycloakBefore();
    loginPage.logIn();
    sidebarPage.goToUserFederation();
  });

  it("Create Kerberos provider from empty state", () => {
    // if tests don't start at empty state, e.g. user has providers configured locally,
    // create a new card from the card view instead
    cy.get("body").then(($body) => {
      if ($body.find(`[data-testid=kerberos-card]`).length > 0) {
        providersPage.clickNewCard(provider);
      } else {
        providersPage.clickMenuCommand(addProviderMenu, initCapProvider);
      }
    });
    providersPage.fillKerberosRequiredData(
      firstKerberosName,
      firstKerberosRealm,
      firstKerberosPrincipal,
      firstKerberosKeytab
    );
    providersPage.save(provider);

    masthead.checkNotificationMessage(createdSuccessMessage);
    sidebarPage.goToUserFederation();
  });

  it("Update an existing Kerberos provider and save", () => {
    providersPage.clickExistingCard(firstKerberosName);
    providersPage.selectCacheType(newPolicy);
    providersPage.changeCacheTime("day", newKerberosDay);
    providersPage.changeCacheTime("hour", newKerberosHour);
    providersPage.changeCacheTime("minute", newKerberosMinute);
    providersPage.save(provider);

    masthead.checkNotificationMessage(savedSuccessMessage);
    sidebarPage.goToUserFederation();
    providersPage.clickExistingCard(firstKerberosName);

    expect(cy.contains(newPolicy).should("exist"));
    expect(cy.contains(defaultPolicy).should("not.exist"));
  });

  it("Change existing Kerberos provider and click button to cancel", () => {
    providersPage.clickExistingCard(firstKerberosName);
    providersPage.selectCacheType(newPolicy);

    providersPage.changeCacheTime("day", defaultKerberosDay);
    providersPage.changeCacheTime("hour", defaultKerberosHour);
    providersPage.changeCacheTime("minute", defaultKerberosMinute);

    providersPage.cancel(provider);
    cy.wait(1000);

    providersPage.clickExistingCard(firstKerberosName);
    providersPage.selectCacheType(newPolicy);

    providersPage.verifyChangedHourInput(newKerberosHour, defaultKerberosHour);
    sidebarPage.goToUserFederation();
  });

  it("Disable an existing Kerberos provider", () => {
    providersPage.clickExistingCard(firstKerberosName);
    providersPage.disableEnabledSwitch(initCapProvider);

    modalUtils.checkModalTitle(disableModalTitle).confirmModal();

    masthead.checkNotificationMessage(savedSuccessMessage);
    sidebarPage.goToUserFederation();
    masthead.checkNotificationMessage(savedSuccessMessage);

    sidebarPage.goToUserFederation();
    expect(cy.contains("Disabled").should("exist"));
  });

  it("Enable an existing previously-disabled Kerberos provider", () => {
    providersPage.clickExistingCard(firstKerberosName);
    providersPage.enableEnabledSwitch(initCapProvider);

    masthead.checkNotificationMessage(savedSuccessMessage);

    sidebarPage.goToUserFederation();
    expect(cy.contains("Enabled").should("exist"));
  });

  it("Create new Kerberos provider using the New Provider dropdown", () => {
    providersPage.clickMenuCommand(addProviderMenu, initCapProvider);

    providersPage.fillKerberosRequiredData(
      secondKerberosName,
      secondKerberosRealm,
      secondKerberosPrincipal,
      secondKerberosKeytab
    );
    providersPage.save(provider);

    masthead.checkNotificationMessage(createdSuccessMessage);
    sidebarPage.goToUserFederation();
  });

  it("Change the priority order of Kerberos providers", () => {
    const priorityDialog = new PriorityDialog();
    const providers = [
      firstKerberosName,
      secondKerberosName,
      thirdKerberosName,
    ];

    sidebarPage.goToUserFederation();
    providersPage.clickMenuCommand(addProviderMenu, initCapProvider);

    providersPage.fillKerberosRequiredData(
      thirdKerberosName,
      thirdKerberosRealm,
      thirdKerberosPrincipal,
      thirdKerberosKeytab
    );
    providersPage.save(provider);
    masthead.checkNotificationMessage(createdSuccessMessage, true);

    sidebarPage.goToUserFederation();
    priorityDialog.openDialog().checkOrder(providers);
    priorityDialog.clickSave();
    masthead.checkNotificationMessage(changeSuccessMsg, true);

    /*
    Drag and drop is working in product but not in cypress. Order should be
    validated with the following if the cypress issue is ever resolved.

    priorityDialog.moveRowTo(firstKerberosName, thirdKerberosName);
    priorityDialog.clickSave();
    masthead.checkNotificationMessage(changeSuccessMsg, true);
     
    priorityDialog
      .openDialog()
      .checkOrder([secondKerberosName, thirdKerberosName, firstKerberosName]);
    */
  });

  it("Delete a Kerberos provider from card view using the card's menu", () => {
    providersPage.deleteCardFromCard(secondKerberosName);
    modalUtils.checkModalTitle(deleteModalTitle).confirmModal();
    masthead.checkNotificationMessage(deletedSuccessMessage);
  });

  it("Delete a Kerberos provider using the Settings view's Action menu", () => {
    providersPage.deleteCardFromMenu(thirdKerberosName);
    modalUtils.checkModalTitle(deleteModalTitle).confirmModal();
    masthead.checkNotificationMessage(deletedSuccessMessage);

    providersPage.deleteCardFromMenu(firstKerberosName);
    modalUtils.checkModalTitle(deleteModalTitle).confirmModal();
    masthead.checkNotificationMessage(deletedSuccessMessage);
  });
});
