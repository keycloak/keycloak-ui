import ClientRolesTab from "../support/pages/admin_console/manage/clients/ClientRolesTab";
import createRealmRolePage from "../support/pages/admin_console/manage/realm_roles/CreateRealmRolePage";
import AssociatedRolesPage from "../support/pages/admin_console/manage/realm_roles/AssociatedRolesPage";

import LoginPage from "../support/pages/LoginPage";
import { keycloakBefore } from "../support/util/keycloak_hooks";
import adminClient from "../support/util/AdminClient";
import CreateClientPage from "../support/pages/admin_console/manage/clients/CreateClientPage";
import CommonPage from "../support/pages/CommonPage";

const itemId = "client_crud";
const loginPage = new LoginPage();
const createClientPage = new CreateClientPage();
const commonPage = new CommonPage();
const associatedRolesPage = new AssociatedRolesPage();

describe.only("Roles tab test", () => {
  const rolesTab = new ClientRolesTab();
  let client: string;

  before(() => {
    keycloakBefore();
    loginPage.logIn();
    commonPage.sidebar().goToClients();

    client = "client_" + (Math.random() + 1).toString(36).substring(7);

    commonPage.tableToolbarUtils().createClient();

    createClientPage
      .selectClientType("openid-connect")
      .fillClientData(client)
      .continue()
      .save();
    commonPage
      .masthead()
      .checkNotificationMessage("Client created successfully", true);
  });

  beforeEach(() => {
    keycloakBefore();
    loginPage.logIn();
    commonPage.sidebar().goToClients();
    commonPage.tableToolbarUtils().searchItem(client);
    commonPage.tableUtils().clickRowItemLink(client);
    rolesTab.goToRolesTab();
  });

  after(() => {
    adminClient.deleteClient(client);
  });

  it("Should fail to create client role with empty name", () => {
    rolesTab.goToCreateRoleFromEmptyState();
    createRealmRolePage.fillRealmRoleData("").save();
    createRealmRolePage.checkRealmRoleNameRequiredMessage();
  });

  it("Should create client role", () => {
    rolesTab.goToCreateRoleFromEmptyState();
    createRealmRolePage.fillRealmRoleData(itemId).save();
    commonPage.masthead().checkNotificationMessage("Role created", true);
  });

  it("Should update client role description", () => {
    const updateDescription = "updated description";
    commonPage.tableToolbarUtils().searchItem(itemId, false);
    commonPage.tableUtils().clickRowItemLink(itemId);
    createRealmRolePage.updateDescription(updateDescription).save();
    commonPage
      .masthead()
      .checkNotificationMessage("The role has been saved", true);
    createRealmRolePage.checkDescription(updateDescription);
  });

  it("Should add attribute to client role", () => {
    cy.intercept("/admin/realms/master/roles-by-id/*").as("load");
    commonPage.tableUtils().clickRowItemLink(itemId);
    rolesTab.goToAttributesTab();
    cy.wait(["@load", "@load"]);
    rolesTab.addAttribute(1, "crud_attribute_key", "crud_attribute_value");
    rolesTab.checkRowItemsEqualTo(1);
    commonPage
      .masthead()
      .checkNotificationMessage("The role has been saved", true);
  });

  it("Should delete attribute from client role", () => {
    cy.intercept("/admin/realms/master/roles-by-id/*").as("load");
    commonPage.tableUtils().clickRowItemLink(itemId);
    rolesTab.goToAttributesTab();
    cy.wait(["@load", "@load"]);
    rolesTab.deleteAttribute(1);
    commonPage
      .masthead()
      .checkNotificationMessage("The role has been saved", true);
  });

  it("Should create client role to be deleted", () => {
    rolesTab.goToCreateRoleFromToolbar();
    createRealmRolePage.fillRealmRoleData("client_role_to_be_deleted").save();
    commonPage.masthead().checkNotificationMessage("Role created", true);
  });

  it("Should fail to create duplicate client role", () => {
    rolesTab.goToCreateRoleFromToolbar();
    createRealmRolePage.fillRealmRoleData(itemId).save();
    commonPage
      .masthead()
      .checkNotificationMessage(
        `Could not create role: Role with name ${itemId} already exists`,
        true
      );
  });

  it("Should search existing client role", () => {
    commonPage.tableToolbarUtils().searchItem(itemId, false);
    commonPage.tableUtils().checkRowItemExists(itemId);
  });

  it("Should search non-existing role test", () => {
    commonPage.tableToolbarUtils().searchItem("role_DNE", false);
    commonPage.emptyState().checkIfExists(true);
  });

  it("roles empty search test", () => {
    commonPage.tableToolbarUtils().searchItem("", false);
    commonPage.tableUtils().checkIfExists(true);
  });

  it("Add associated roles test", () => {
    commonPage.tableToolbarUtils().searchItem(itemId, false);
    commonPage.tableUtils().clickRowItemLink(itemId);

    // Add associated realm role
    associatedRolesPage.addAssociatedRealmRole("create-realm");
    commonPage
      .masthead()
      .checkNotificationMessage("Associated roles have been added", true);

    // Add associated client role
    associatedRolesPage.addAssociatedRoleFromSearchBar("create-client", true);
    commonPage
      .masthead()
      .checkNotificationMessage("Associated roles have been added", true);

    rolesTab.goToAssociatedRolesTab();

    // Add associated client role
    associatedRolesPage.addAssociatedRoleFromSearchBar("manage-consent", true);
    commonPage
      .masthead()
      .checkNotificationMessage("Associated roles have been added", true);
  });

  it("Should hide inherited roles test", () => {
    commonPage.tableToolbarUtils().searchItem(itemId, false);
    commonPage.tableUtils().clickRowItemLink(itemId);
    rolesTab.goToAssociatedRolesTab().hideInheritedRoles();
  });

  it("Should delete associated roles test", () => {
    commonPage.tableToolbarUtils().searchItem(itemId, false);
    commonPage.tableUtils().clickRowItemLink(itemId);
    rolesTab.goToAssociatedRolesTab();
    commonPage.tableUtils().selectRowItemAction("create-realm", "Remove");
    commonPage.sidebar().waitForPageLoad();
    commonPage
      .modalUtils()
      .checkModalTitle("Remove associated role?")
      .confirmModal();
    commonPage.sidebar().waitForPageLoad();

    commonPage
      .masthead()
      .checkNotificationMessage("Associated roles have been removed", true);

    commonPage.tableUtils().selectRowItemAction("manage-consent", "Remove");
    commonPage.sidebar().waitForPageLoad();
    commonPage
      .modalUtils()
      .checkModalTitle("Remove associated role?")
      .confirmModal();
  });

  it("Should delete associated role from search bar test", () => {
    commonPage.tableToolbarUtils().searchItem(itemId, false);
    commonPage.tableUtils().clickRowItemLink(itemId);
    commonPage.sidebar().waitForPageLoad();
    rolesTab.goToAssociatedRolesTab();

    cy.get('td[data-label="Role name"]')
      .contains("create-client")
      .parent()
      .within(() => {
        cy.get("input").click();
      });

    associatedRolesPage.removeAssociatedRoles();

    commonPage.sidebar().waitForPageLoad();
    commonPage
      .modalUtils()
      .checkModalTitle("Remove associated roles?")
      .confirmModal();
    commonPage.sidebar().waitForPageLoad();

    commonPage
      .masthead()
      .checkNotificationMessage("Associated roles have been removed", true);
  });

  it("Should delete client role test", () => {
    commonPage.tableUtils().selectRowItemAction(itemId, "Delete");
    commonPage.sidebar().waitForPageLoad();
    commonPage.modalUtils().checkModalTitle("Delete role?").confirmModal();
  });

  it("Should delete client role from role details test", () => {
    commonPage
      .tableToolbarUtils()
      .searchItem("client_role_to_be_deleted", false);
    commonPage.tableUtils().clickRowItemLink("client_role_to_be_deleted");
    createRealmRolePage.clickActionMenu("Delete this role");
    commonPage.modalUtils().confirmModal();
    commonPage
      .masthead()
      .checkNotificationMessage("The role has been deleted", true);
  });
});
