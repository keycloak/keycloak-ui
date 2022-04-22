import LoginPage from "../support/pages/LoginPage";
import {
  Filter,
  FilterAssignedType,
} from "../support/pages/admin_console/ListingPage";
import { keycloakBefore } from "../support/util/keycloak_hooks";
import adminClient from "../support/util/AdminClient";
import CommonPage from "../support/pages/CommonPage";
import ClientDetailsPage from "../support/pages/admin_console/manage/clients/client_details/ClientDetailsPage";

const loginPage = new LoginPage();
const commonPage = new CommonPage();
const clientDetailsPage = new ClientDetailsPage();

describe("Client details - Client scopes subtab", () => {
  const clientId = "client-scopes-subtab-test";
  const clientScopeName = "client-scope-test";
  const clientScopeNameDefaultType = "client-scope-test-default-type";
  const clientScopeNameOptionalType = "client-scope-test-optional-type";
  const clientScope = {
    name: clientScopeName,
    description: "",
    protocol: "openid-connect",
    attributes: {
      "include.in.token.scope": "true",
      "display.on.consent.screen": "true",
      "gui.order": "1",
      "consent.screen.text": "",
    },
  };
  const msgScopeMappingRemoved = "Scope mapping successfully removed";

  before(async () => {
    adminClient.createClient({
      clientId,
      protocol: "openid-connect",
      publicClient: false,
    });
    for (let i = 0; i < 5; i++) {
      clientScope.name = clientScopeName + i;
      await adminClient.createClientScope(clientScope);
      await adminClient.addDefaultClientScopeInClient(
        clientScopeName + i,
        clientId
      );
    }
    clientScope.name = clientScopeNameDefaultType;
    await adminClient.createClientScope(clientScope);
    clientScope.name = clientScopeNameOptionalType;
    await adminClient.createClientScope(clientScope);
  });

  beforeEach(() => {
    keycloakBefore();
    loginPage.logIn();
    commonPage.sidebar().goToClients();
    cy.intercept("/admin/realms/master/clients/*").as("fetchClient");
    commonPage.tableToolbarUtils().searchItem(clientId);
    commonPage.tableUtils().clickRowItemLink(clientId);
    cy.wait("@fetchClient");
    clientDetailsPage.goToClientScopesTab();
  });

  after(async () => {
    adminClient.deleteClient(clientId);
    for (let i = 0; i < 5; i++) {
      await adminClient.deleteClientScope(clientScopeName + i);
    }
    await adminClient.deleteClientScope(clientScopeNameDefaultType);
    await adminClient.deleteClientScope(clientScopeNameOptionalType);
  });

  it("Should list client scopes", () => {
    commonPage
      .tableUtils()
      .checkRowItemsGreaterThan(1)
      .checkRowItemExists(clientScopeName + 0);
  });

  it("Should search existing client scope by name", () => {
    commonPage.tableToolbarUtils().searchItem(clientScopeName + 0, false);
    commonPage
      .tableUtils()
      .checkRowItemExists(clientScopeName + 0)
      .checkRowItemsEqualTo(2);
  });

  it("Should search non-existent client scope by name", () => {
    commonPage.tableToolbarUtils().searchItem("non-existent-item", false);
    commonPage.tableUtils().checkIfExists(false);
    commonPage.emptyState().checkIfExists(true);
  });

  it("Should search existing client scope by assigned type", () => {
    commonPage
      .tableToolbarUtils()
      .selectSearchType(Filter.AssignedType)
      .selectSecondarySearchType(FilterAssignedType.Default);
    commonPage
      .tableUtils()
      .checkRowItemExists(FilterAssignedType.Default)
      .checkRowItemExists(FilterAssignedType.Optional, false);
    commonPage
      .tableToolbarUtils()
      .selectSecondarySearchType(FilterAssignedType.Optional);
    commonPage
      .tableUtils()
      .checkRowItemExists(FilterAssignedType.Default, false)
      .checkRowItemExists(FilterAssignedType.Optional);
    commonPage
      .tableToolbarUtils()
      .selectSecondarySearchType(FilterAssignedType.AllTypes);
    commonPage
      .tableUtils()
      .checkRowItemExists(FilterAssignedType.Default)
      .checkRowItemExists(FilterAssignedType.Optional);
  });

  const newItemsWithExpectedAssignedTypes = [
    [clientScopeNameOptionalType, FilterAssignedType.Optional],
    [clientScopeNameDefaultType, FilterAssignedType.Default],
  ];
  newItemsWithExpectedAssignedTypes.forEach(($type) => {
    const [itemName, assignedType] = $type;
    it(`Should add client scope ${itemName} with ${assignedType} assigned type`, () => {
      commonPage.tableToolbarUtils().addClientScope();
      commonPage
        .modalUtils()
        .checkModalTitle("Add client scopes to " + clientId);
      commonPage.tableUtils().selectRowItemCheckbox(itemName);
      commonPage.modalUtils().confirmModalWithItem(assignedType);
      commonPage
        .masthead()
        .checkNotificationMessage("Scope mapping successfully updated");
      commonPage.tableToolbarUtils().searchItem(itemName, false);
      commonPage
        .tableUtils()
        .checkRowItemExists(itemName)
        .checkRowItemExists(assignedType);
    });
  });

  const expectedItemAssignedTypes = [
    FilterAssignedType.Optional,
    FilterAssignedType.Default,
  ];
  expectedItemAssignedTypes.forEach(($assignedType) => {
    const itemName = clientScopeName + 0;
    it(`Should change item ${itemName} AssignedType to ${$assignedType} from search bar`, () => {
      commonPage.tableToolbarUtils().searchItem(itemName, false);
      commonPage.tableUtils().selectRowItemCheckbox(itemName);
      commonPage.tableToolbarUtils().changeTypeTo($assignedType);
      commonPage.masthead().checkNotificationMessage("Scope mapping updated");
      commonPage.tableToolbarUtils().searchItem(itemName, false);
      commonPage.tableUtils().checkRowItemExists($assignedType);
    });
  });

  it("Should show items on next page are more than 11", () => {
    commonPage.sidebar().waitForPageLoad();
    commonPage.tableToolbarUtils().clickNextPageButton();
    commonPage.tableUtils().checkRowItemsGreaterThan(1);
  });

  it("Should remove client scope from item bar", () => {
    const itemName = clientScopeName + 0;
    commonPage.tableToolbarUtils().searchItem(itemName, false);
    commonPage.tableUtils().selectRowItemAction(itemName, "Remove");
    commonPage.masthead().checkNotificationMessage(msgScopeMappingRemoved);
    commonPage.tableToolbarUtils().searchItem(itemName, false);
    commonPage.tableUtils().checkRowItemExists(itemName, false);
  });

  // TODO: https://github.com/keycloak/keycloak-admin-ui/issues/1854
  it("Should remove multiple client scopes from search bar", () => {
    const itemName1 = clientScopeName + 1;
    const itemName2 = clientScopeName + 2;
    commonPage.tableToolbarUtils().clickSearchButton();
    commonPage.tableToolbarUtils().checkActionItemIsEnabled("Remove", false);
    commonPage.tableToolbarUtils().searchItem(clientScopeName, false);
    commonPage
      .tableUtils()
      .selectRowItemCheckbox(itemName1)
      .selectRowItemCheckbox(itemName2);
    commonPage.tableToolbarUtils().clickSearchButton();
    commonPage.tableToolbarUtils().clickActionItem("Remove");
    commonPage.masthead().checkNotificationMessage(msgScopeMappingRemoved);
    commonPage.tableToolbarUtils().searchItem(clientScopeName, false);
    commonPage
      .tableUtils()
      .checkRowItemExists(itemName1, false)
      .checkRowItemExists(itemName2, false);
    commonPage.tableToolbarUtils().clickSearchButton();
  });

  //fails, issue https://github.com/keycloak/keycloak-admin-ui/issues/1874
  it.skip("Should show initial items after filtering", () => {
    commonPage
      .tableToolbarUtils()
      .selectSearchType(Filter.AssignedType)
      .selectSecondarySearchType(FilterAssignedType.Optional)
      .selectSearchType(Filter.Name);
    commonPage
      .tableUtils()
      .checkRowItemExists(FilterAssignedType.Default)
      .checkRowItemExists(FilterAssignedType.Optional);
  });
});
