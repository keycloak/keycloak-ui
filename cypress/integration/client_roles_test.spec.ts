import ClientRolesTab from "../support/pages/admin_console/manage/clients/ClientRolesTab";
import CreateRealmRolePage from "../support/pages/admin_console/manage/realm_roles/CreateRealmRolePage";
import AssociatedRolesPage from "../support/pages/admin_console/manage/realm_roles/AssociatedRolesPage";
import CreateClientPage from "../support/pages/admin_console/manage/clients/CreateClientPage";

import LoginPage from "../support/pages/LoginPage";
import ModalUtils from "../support/util/ModalUtils";
import SidebarPage from "../support/pages/admin_console/SidebarPage";
import ListingPage from "../support/pages/admin_console/ListingPage";
import Masthead from "../support/pages/admin_console/Masthead";
import { keycloakBefore } from "../support/util/keycloak_hooks";
import adminClient from "../support/util/AdminClient";

const loginPage = new LoginPage();
const sidebarPage = new SidebarPage();
const listingPage = new ListingPage();
const masthead = new Masthead();
const modalUtils = new ModalUtils();

describe("Roles tab test", () => {
  const rolesTab = new ClientRolesTab();
  const associatedRolesPage = new AssociatedRolesPage();
  const createRealmRolePage = new CreateRealmRolePage();
  const createClientPage = new CreateClientPage();

  let client: string;
  const itemId = "client_role_id";

  before(() => {
    keycloakBefore();
    loginPage.logIn();
    sidebarPage.goToClients();

    client = "client_" + (Math.random() + 1).toString(36).substring(7);

    listingPage.goToCreateItem();

    createClientPage
      .selectClientType("openid-connect")
      .fillClientData(client)
      .continue()
      .save();
    masthead.checkNotificationMessage("Client created successfully", true);
  });

  beforeEach(() => {
    sidebarPage.goToClients();
    listingPage.searchItem(client).goToItemDetails(client);
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
    masthead.checkNotificationMessage("Role created", true);
  });

  it("Should update client role description", () => {
    listingPage.searchItem(itemId, false).goToItemDetails(itemId);
    const updateDescription = "updated description";
    createRealmRolePage.updateDescription(updateDescription).save();
    masthead.checkNotificationMessage("The role has been saved", true);
    createRealmRolePage.checkDescription(updateDescription);
  });

  it("Should add attribute to client role", () => {
    cy.intercept("/admin/realms/master/roles-by-id/*").as("load");
    listingPage.goToItemDetails(itemId);
    rolesTab.goToAttributesTab();
    cy.wait(["@load", "@load", "@load", "@load"]);
    rolesTab.addAttribute();

    masthead.checkNotificationMessage("The role has been saved", true);
  });

  it("Should delete attribute from client role", () => {
    cy.intercept("/admin/realms/master/roles-by-id/*").as("load");
    listingPage.goToItemDetails(itemId);
    rolesTab.goToAttributesTab();
    cy.wait(["@load", "@load", "@load", "@load"]);
    rolesTab.deleteAttribute();
    masthead.checkNotificationMessage("The role has been saved", true);
  });

  it("Should create client role to be deleted", () => {
    rolesTab.goToCreateRoleFromToolbar();
    createRealmRolePage.fillRealmRoleData("client_role_to_be_deleted").save();
    masthead.checkNotificationMessage("Role created", true);
  });

  it("Should fail to create duplicate client role", () => {
    rolesTab.goToCreateRoleFromToolbar();
    createRealmRolePage.fillRealmRoleData(itemId).save();
    masthead.checkNotificationMessage(
      `Could not create role: Role with name ${itemId} already exists`,
      true
    );
  });

  it("Should search existing client role", () => {
    listingPage.searchItem(itemId, false).itemExist(itemId);
  });

  it("Should search non-existing role test", () => {
    listingPage.searchItem("role_DNE", false);
    cy.findByTestId(listingPage.emptyState).should("exist");
  });

  it("roles empty search test", () => {
    listingPage.searchItem("", false);
    cy.get("table:visible");
  });

  it("Add associated roles test", () => {
    listingPage.searchItem(itemId, false).goToItemDetails(itemId);

    // Add associated realm role
    associatedRolesPage.addAssociatedRealmRole("create-realm");
    masthead.checkNotificationMessage("Associated roles have been added", true);

    // Add associated client role
    associatedRolesPage.addAssociatedRoleFromSearchBar("create-client", true);
    masthead.checkNotificationMessage("Associated roles have been added", true);

    rolesTab.goToAssociatedRolesTab();

    // Add associated client role
    associatedRolesPage.addAssociatedRoleFromSearchBar("manage-consent", true);
    masthead.checkNotificationMessage("Associated roles have been added", true);
  });

  it("Should hide inherited roles test", () => {
    listingPage.searchItem(itemId, false).goToItemDetails(itemId);
    rolesTab.goToAssociatedRolesTab();
    rolesTab.hideInheritedRoles();
  });

  it("Should delete associated roles test", () => {
    listingPage.searchItem(itemId, false).goToItemDetails(itemId);
    rolesTab.goToAssociatedRolesTab();
    listingPage.removeItem("create-realm");
    sidebarPage.waitForPageLoad();
    modalUtils.checkModalTitle("Remove associated role?").confirmModal();
    sidebarPage.waitForPageLoad();

    masthead.checkNotificationMessage(
      "Associated roles have been removed",
      true
    );

    listingPage.removeItem("manage-consent");
    sidebarPage.waitForPageLoad();
    modalUtils.checkModalTitle("Remove associated role?").confirmModal();
  });

  it("Should delete associated role from search bar test", () => {
    listingPage.searchItem(itemId, false).goToItemDetails(itemId);
    sidebarPage.waitForPageLoad();
    rolesTab.goToAssociatedRolesTab();

    cy.get('td[data-label="Role name"]')
      .contains("create-client")
      .parent()
      .within(() => {
        cy.get("input").click();
      });

    associatedRolesPage.removeAssociatedRoles();

    sidebarPage.waitForPageLoad();
    modalUtils.checkModalTitle("Remove associated roles?").confirmModal();
    sidebarPage.waitForPageLoad();

    masthead.checkNotificationMessage(
      "Associated roles have been removed",
      true
    );
  });

  it("Should delete client role test", () => {
    listingPage.deleteItem(itemId);
    sidebarPage.waitForPageLoad();
    modalUtils.checkModalTitle("Delete role?").confirmModal();
  });

  it("Should delete client role from role details test", () => {
    listingPage
      .searchItem("client_role_to_be_deleted", false)
      .goToItemDetails("client_role_to_be_deleted");
    createRealmRolePage.clickActionMenu("Delete this role");
    modalUtils.confirmModal();
    masthead.checkNotificationMessage("The role has been deleted", true);
  });
});
