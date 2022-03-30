import LoginPage from "../support/pages/LoginPage";
import SidebarPage from "../support/pages/admin_console/SidebarPage";
import ProviderPage from "../support/pages/admin_console/manage/providers/ProviderPage";
import Masthead from "../support/pages/admin_console/Masthead";
import ModalUtils from "../support/util/ModalUtils";
import { keycloakBefore } from "../support/util/keycloak_hooks";
// import { first } from "cypress/types/lodash";

const loginPage = new LoginPage();
const masthead = new Masthead();
const sidebarPage = new SidebarPage();
const providersPage = new ProviderPage();
const modalUtils = new ModalUtils();

const provider = "ldap";
const allCapProvider = provider.toUpperCase();

const firstLdapName = "my-ldap";
const firstLdapVendor = "Active Directory";

// connection and authentication settings
const connectionUrlInvalid = "ldap://nowhere.com";
const connectionUrlValid = "ldap://ldap.forumsys.com:389";
const truststoreSpiNever = "Never";
// const truststoreSpiOnlyLdaps = "Only for ldaps";
const connectionTimeoutTwoSecs = "2000";
// const connectionTimeoutZeroSecs = "0";
const bindTypeSimple = "simple";
const bindTypeNone = "none";
// const bindDnCnDc = "cn=read-only-admin,dc=example,dc=com";
const bindDnCnOnly = "cn=read-only-admin";
// const bindCredsValid = "password";
const bindCredsInvalid = "not-my-password";

// ldap searching and updating
const editModeReadOnly = "READ_ONLY";
const firstUsersDn = "user-dn-1";
const firstUserLdapAtt = "uid";
const firstRdnLdapAtt = "uid";
const firstUuidLdapAtt = "entryUUID";
const firstUserObjClasses = "inetOrgPerson, organizationalPerson";

const secondLdapName = `${firstLdapName}-2`;
const secondLdapVendor = "Other";

const editModeWritable = "WRITABLE";

const secondUsersDn = "user-dn-2";
const secondUserLdapAtt = "cn";
const secondRdnLdapAtt = "cn";
const secondUuidLdapAtt = "objectGUID";
const secondUserObjClasses = "person, organizationalPerson, user";

const updatedLdapName = `${firstLdapName}-updated`;

const defaultPolicy = "DEFAULT";
const newPolicy = "EVICT_WEEKLY";
const defaultLdapDay = "Sunday";
const defaultLdapHour = "00";
const defaultLdapMinute = "00";
const newLdapDay = "Wednesday";
const newLdapHour = "15";
const newLdapMinute = "55";

const addProviderMenu = "Add new provider";
const createdSuccessMessage = "User federation provider successfully created";
const savedSuccessMessage = "User federation provider successfully saved";
const deletedSuccessMessage = "The user federation provider has been deleted.";
const deleteModalTitle = "Delete user federation provider?";
const disableModalTitle = "Disable user federation provider?";

// const ldapTestSuccessMsg = "Successfully connected to LDAP";
// const ldapTestFailMsg =
//   "Error when trying to connect to LDAP. See server.log for details. LDAP test error";

describe("User Fed LDAP tests", () => {
  beforeEach(() => {
    keycloakBefore();
    loginPage.logIn();
    sidebarPage.goToUserFederation();
  });

  it("Create Ldap provider from empty state", () => {
    // if tests don't start at empty state, e.g. user has providers configured locally,
    // create a new card from the card view instead
    cy.get("body").then(($body) => {
      if ($body.find(`[data-testid=ldap-card]`).length > 0) {
        providersPage.clickNewCard(provider);
      } else {
        providersPage.clickMenuCommand(addProviderMenu, allCapProvider);
      }
    });
    providersPage.fillLdapRequiredGeneralData(firstLdapName, firstLdapVendor);

    providersPage.fillLdapRequiredConnectionData(
      connectionUrlInvalid,
      truststoreSpiNever,
      connectionTimeoutTwoSecs,
      bindTypeSimple,
      bindDnCnOnly,
      bindCredsInvalid
    );

    providersPage.fillLdapRequiredSearchingData(
      editModeReadOnly,
      firstUsersDn,
      firstUserLdapAtt,
      firstRdnLdapAtt,
      firstUuidLdapAtt,
      firstUserObjClasses
    );

    providersPage.save(provider);

    masthead.checkNotificationMessage(createdSuccessMessage);
    sidebarPage.goToUserFederation();
  });

  it.skip("Update an existing LDAP provider and save", () => {
    providersPage.clickExistingCard(firstLdapName);
    providersPage.selectCacheType(newPolicy);

    providersPage.changeCacheTime("day", newLdapDay);
    providersPage.changeCacheTime("hour", newLdapHour);
    providersPage.changeCacheTime("minute", newLdapMinute);

    providersPage.save(provider);
    masthead.checkNotificationMessage(savedSuccessMessage);

    sidebarPage.goToUserFederation();
    providersPage.clickExistingCard(firstLdapName);

    expect(cy.contains(newPolicy).should("exist"));
    expect(cy.contains(defaultPolicy).should("not.exist"));
  });

  it.skip("Update connection and authentication settings and save", () => {
    providersPage.clickExistingCard(firstLdapName);

    providersPage.fillLdapRequiredConnectionData(
      connectionUrlInvalid,
      truststoreSpiNever,
      connectionTimeoutTwoSecs,
      bindTypeNone
    );
    providersPage.toggleSwitch(providersPage.enableStartTls);
    providersPage.toggleSwitch(providersPage.connectionPooling);

    providersPage.save(provider);
    masthead.checkNotificationMessage(savedSuccessMessage);

    // now verify
    sidebarPage.goToUserFederation();
    providersPage.clickExistingCard(firstLdapName);

    providersPage.verifyTextField(
      providersPage.connectionUrlInput,
      connectionUrlInvalid
    );

    // MF Can't use the new verifyTextField with Selects, just text fields
    // providersPage.verifyTextField(
    //   providersPage.truststoreSpiInput,
    //   truststoreSpiNever
    // );

    providersPage.verifyTextField(
      providersPage.connectionTimeoutInput,
      connectionTimeoutTwoSecs
    );
    // MF Can't use the new verifyTextField with Selects, just text fields
    // providersPage.verifyTextField(providersPage.bindTypeInput, bindTypeNone);

    // providersPage.verifyTextField(providersPage.bindDnInput, connectionUrlInvalid);
    // providersPage.verifyTextField(providersPage.bindCredsInput, connectionUrlInvalid);
    providersPage.verifyToggle(providersPage.enableStartTls, "on");
    providersPage.verifyToggle(providersPage.connectionPooling, "on");
    sidebarPage.goToUserFederation();
  });

  it.skip("Should fail connection and authentication tests", () => {
    providersPage.clickExistingCard(firstLdapName);

    // click Test connection button (Test connection should fail)
    // click Test authentication button (Test connection should fail)

    sidebarPage.goToUserFederation();
  });

  it.skip("Should make changes and pass connection and authentication tests", () => {
    providersPage.clickExistingCard(firstLdapName);
    // set enable startTLS switch to OFF
    // set Use Truststore SPI dropdown to Only for ldaps
    // set Connection pooling to OFF
    // enter Bind type to simple
    // enter bind DN of "cn=read-only-admin,dc=example,dc=com"
    // enter bind credentials of "password"
    // click Save (save should succeed)

    // click Test connection button (Test connection should succeed)
    // click Test authentication button (Test connection should succeed)

    sidebarPage.goToUserFederation();
  });

  it.skip("Should update display name", () => {
    providersPage.clickExistingCard(firstLdapName);
    providersPage.fillLdapRequiredGeneralData(updatedLdapName);

    providersPage.save(provider);
    masthead.checkNotificationMessage(savedSuccessMessage);

    sidebarPage.goToUserFederation();
    providersPage.clickExistingCard(updatedLdapName);

    sidebarPage.goToUserFederation();
  });

  it.skip("Change existing LDAP provider and click button to cancel", () => {
    providersPage.clickExistingCard(updatedLdapName);
    providersPage.selectCacheType(newPolicy);

    providersPage.changeCacheTime("day", defaultLdapDay);
    providersPage.changeCacheTime("hour", defaultLdapHour);
    providersPage.changeCacheTime("minute", defaultLdapMinute);

    providersPage.cancel(provider);

    providersPage.clickExistingCard(updatedLdapName);
    providersPage.selectCacheType(newPolicy);

    providersPage.verifyChangedHourInput(newLdapHour, defaultLdapHour);

    sidebarPage.goToUserFederation();
  });

  it("Disable an existing LDAP provider", () => {
    providersPage.clickExistingCard(firstLdapName);
    providersPage.disableEnabledSwitch(allCapProvider);

    modalUtils.checkModalTitle(disableModalTitle).confirmModal();

    masthead.checkNotificationMessage(savedSuccessMessage);
    // sidebarPage.goToUserFederation();
    // masthead.checkNotificationMessage(savedSuccessMessage);

    sidebarPage.goToUserFederation();
    expect(cy.contains("Disabled").should("exist"));
  });

  it("Enable an existing previously-disabled LDAP provider", () => {
    providersPage.clickExistingCard(firstLdapName);
    providersPage.enableEnabledSwitch(allCapProvider);

    masthead.checkNotificationMessage(savedSuccessMessage);

    sidebarPage.goToUserFederation();
    expect(cy.contains("Enabled").should("exist"));
  });

  it.skip("Create new LDAP provider using the New Provider dropdown", () => {
    providersPage.clickMenuCommand(addProviderMenu, allCapProvider);
    providersPage.fillLdapRequiredGeneralData(secondLdapName, secondLdapVendor);
    providersPage.fillLdapRequiredConnectionData(
      connectionUrlValid,
      truststoreSpiNever,
      connectionTimeoutTwoSecs,
      bindTypeSimple,
      bindDnCnOnly,
      bindCredsInvalid
    );
    providersPage.fillLdapRequiredSearchingData(
      editModeWritable,
      secondUsersDn,
      secondUserLdapAtt,
      secondRdnLdapAtt,
      secondUuidLdapAtt,
      secondUserObjClasses
    );
    providersPage.save(provider);
    masthead.checkNotificationMessage(createdSuccessMessage);
    sidebarPage.goToUserFederation();
  });

  // temp
  it("Delete an LDAP provider from card view using the card's menu", () => {
    providersPage.deleteCardFromCard(firstLdapName);
    modalUtils.checkModalTitle(deleteModalTitle).confirmModal();
    masthead.checkNotificationMessage(deletedSuccessMessage);
  });

  it.skip("Delete an LDAP provider from card view using the card's menu", () => {
    providersPage.deleteCardFromCard(secondLdapName);
    modalUtils.checkModalTitle(deleteModalTitle).confirmModal();
    masthead.checkNotificationMessage(deletedSuccessMessage);
  });

  it.skip("Delete an LDAP provider using the Settings view's Action menu", () => {
    providersPage.deleteCardFromMenu(updatedLdapName);
    modalUtils.checkModalTitle(deleteModalTitle).confirmModal();
    masthead.checkNotificationMessage(deletedSuccessMessage);
  });
});
