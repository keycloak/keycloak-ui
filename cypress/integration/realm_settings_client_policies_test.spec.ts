import SidebarPage from "../support/pages/admin_console/SidebarPage";
import LoginPage from "../support/pages/LoginPage";
import RealmSettingsPage from "../support/pages/admin_console/manage/realm_settings/RealmSettingsPage";
import {
  keycloakBefore,
  keycloakBeforeEach,
} from "../support/util/keycloak_hooks";
import AdminClient from "../support/util/AdminClient";
import ModalUtils from "../support/util/ModalUtils";

const loginPage = new LoginPage();
const sidebarPage = new SidebarPage();
const modalUtils = new ModalUtils();

describe("Realm settings client policies tab tests", () => {
  const realmName = "Realm_" + (Math.random() + 1).toString(36).substring(7);
  const realmSettingsPage = new RealmSettingsPage(realmName);

  beforeEach(() => {
    keycloakBeforeEach();
    sidebarPage.goToRealm(realmName);
    sidebarPage.goToRealmSettings();
    cy.findByTestId("rs-clientPolicies-tab").click();
    cy.findByTestId("rs-policies-clientPolicies-tab").click();
  });

  before(() => {
    keycloakBefore();
    new AdminClient().createRealm(realmName);
    loginPage.logIn();
  });

  after(() => {
    new AdminClient().deleteRealm(realmName);
  });

  it("Complete new client form and cancel", () => {
    realmSettingsPage
      .checkDisplayPoliciesTab()
      .createNewClientPolicyFromEmptyState("Test", "Test Description", true)
      .checkNewClientPolicyForm()
      .cancelNewClientPolicyCreation()
      .checkEmptyPolicyList();
  });

  it("Complete new client form and submit", () => {
    const url = `/auth/admin/realms/${realmName}/client-policies/policies`;
    cy.intercept("PUT", url).as("save");

    realmSettingsPage.createNewClientPolicyFromEmptyState(
      "Test",
      "Test Description"
    );
    realmSettingsPage.checkAlertMessage("New policy created");
    cy.wait("@save");
  });

  it("Should perform client profile search by profile name", () => {
    realmSettingsPage.searchClientPolicy("Test");
  });

  it("Should not have conditions configured by default", () => {
    realmSettingsPage.shouldNotHaveConditionsConfigured();
  });

  it("Should cancel adding a new condition to a client profile", () => {
    realmSettingsPage.shouldCancelAddingCondition();
  });

  it("Should add a new client-roles condition to a client profile", () => {
    realmSettingsPage.shouldAddClientRolesCondition();
  });

  it("Should add a new client-scopes condition to a client profile", () => {
    realmSettingsPage.shouldAddClientScopesCondition();
  });

  it("Should edit the client-roles condition of a client profile", () => {
    realmSettingsPage.shouldEditClientRolesCondition();
  });

  it("Should edit the client-scopes condition of a client profile", () => {
    realmSettingsPage.shouldEditClientScopesCondition();
  });

  it("Should cancel deleting condition from a client profile", () => {
    realmSettingsPage.shouldCancelDeletingCondition();
  });

  // TODO: Fix this test so it passes.
  it.skip("Should delete client-roles condition from a client profile", () => {
    realmSettingsPage.shouldDeleteClientRolesCondition();
  });

  // TODO: Fix this test so it passes.
  it.skip("Should delete client-scopes condition from a client profile", () => {
    realmSettingsPage.shouldDeleteClientScopesCondition();
  });

  it("Check cancelling the client policy deletion", () => {
    realmSettingsPage.deleteClientPolicyItemFromTable("Test");
    modalUtils
      .checkModalMessage(
        "This action will permanently delete the policy Test. This cannot be undone."
      )
      .cancelModal();
    realmSettingsPage.checkElementInList("Test");
  });

  it("Check deleting the client policy", () => {
    realmSettingsPage.deleteClientPolicyItemFromTable("Test");

    modalUtils.confirmModal();
    realmSettingsPage
      .checkAlertMessage("Client policy deleted")
      .checkEmptyPolicyList();
  });

  it("Check navigating between Form View and JSON editor", () => {
    realmSettingsPage.shouldNavigateBetweenFormAndJSONViewPolicies();
  });

  it("Should not create duplicate client profile", () => {
    const url = `/auth/admin/realms/${realmName}/client-policies/policies`;
    cy.intercept("PUT", url).as("save");

    realmSettingsPage.createNewClientPolicyFromEmptyState(
      "Test",
      "Test Description"
    );
    realmSettingsPage.checkAlertMessage("New policy created");
    cy.wait("@save");

    sidebarPage.goToRealmSettings();

    realmSettingsPage.goToClientPoliciesTab().goToClientPoliciesList();

    realmSettingsPage.createNewClientPolicyFromList(
      "Test",
      "Test Again Description"
    );
    cy.wait("@save");

    // TODO: UNCOMMENT WHEN THE ISSUE 2050 IS FIXED
    //realmSettingsPage.checkAlertMessage("Could not create client policy: 'proposed client policy name duplicated.'");

    modalUtils.waitForProgressbar();
    sidebarPage.goToRealmSettings();

    realmSettingsPage
      .goToClientPoliciesTab()
      .goToClientPoliciesList()
      .deleteClientPolicyItemFromTable("Test");

    modalUtils.confirmModal();
    realmSettingsPage
      .checkAlertMessage("Client policy deleted")
      .checkEmptyPolicyList();
  });

  it("Check deleting newly created client policy from create view via dropdown", () => {
    const url = `/auth/admin/realms/${realmName}/client-policies/policies`;
    cy.intercept("PUT", url).as("save");
    realmSettingsPage.createNewClientPolicyFromEmptyState(
      "Test again",
      "Test Again Description"
    );
    realmSettingsPage.checkAlertMessage("New policy created");
    modalUtils.waitForProgressbar();
    cy.wait("@save");
    realmSettingsPage.closeAlertMessage().closeAlertMessage();
    realmSettingsPage.deleteClientPolicyFromDetails();
    modalUtils.confirmModal();
    realmSettingsPage.checkAlertMessage("Client policy deleted");
    modalUtils.waitForProgressbar();
    realmSettingsPage.checkEmptyPolicyList();
  });

  it("Check reloading JSON policies", () => {
    realmSettingsPage.shouldReloadJSONPolicies();
  });
});
