import LoginPage from "../support/pages/LoginPage";
import Masthead from "../support/pages/admin_console/Masthead";
import ListingPage, {
  Filter,
  FilterAssignedType,
  FilterProtocol,
} from "../support/pages/admin_console/ListingPage";
import SidebarPage from "../support/pages/admin_console/SidebarPage";
import CreateClientScopePage from "../support/pages/admin_console/manage/client_scopes/CreateClientScopePage";
import { keycloakBefore } from "../support/util/keycloak_hooks";
import RoleMappingTab from "../support/pages/admin_console/manage/RoleMappingTab";
import ModalUtils from "../support/util/ModalUtils";
import adminClient from "../support/util/AdminClient";
import ClientScopesTab from "../support/pages/admin_console/manage/clients/ClientScopesTab";

let itemId = "client_scope_crud";
const loginPage = new LoginPage();
const masthead = new Masthead();
const sidebarPage = new SidebarPage();
const listingPage = new ListingPage();
const createClientScopePage = new CreateClientScopePage();
const modalUtils = new ModalUtils();

describe("Client Scopes test", () => {
  const modalMessageDeleteConfirmation =
    "Are you sure you want to delete this client scope";
  const notificationMessageDeletionConfirmation =
    "The client scope has been deleted";
  const clientScopeName = "client-scope-test";
  const openIDConnectItemText = "OpenID Connect";
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

  before(async () => {
    for (let i = 0; i < 5; i++) {
      clientScope.name = clientScopeName + i;
      await adminClient.createClientScope(clientScope);
    }
  });

  after(async () => {
    for (let i = 0; i < 5; i++) {
      if (await adminClient.existsClientScope(clientScopeName + i)) {
        await adminClient.deleteClientScope(clientScopeName + i);
      }
    }
  });

  describe("Client Scope filter list items", () => {
    before(() => {
      keycloakBefore();
      loginPage.logIn();
    });

    beforeEach(() => {
      sidebarPage.goToClientScopes();
    });

    it("should filter item by name", () => {
      const itemName = clientScopeName + 0;
      listingPage
        .searchItem(itemName, false)
        .itemsEqualTo(1)
        .itemExist(itemName, true);
    });

    it("should filter items by Assigned type All types", () => {
      listingPage
        .selectFilter(Filter.AssignedType)
        .selectSecondaryFilterAssignedType(FilterAssignedType.AllTypes)
        .itemExist(FilterAssignedType.Default, true)
        .itemExist(FilterAssignedType.Optional, true)
        .itemExist(FilterAssignedType.None, true);
    });

    it("should filter items by Assigned type Default", () => {
      listingPage
        .selectFilter(Filter.AssignedType)
        .selectSecondaryFilterAssignedType(FilterAssignedType.Default)
        .itemExist(FilterAssignedType.Default, true)
        .itemExist(FilterAssignedType.Optional, false)
        .itemExist(FilterAssignedType.None, false);
    });

    it("should filter items by Assigned type Optional", () => {
      listingPage
        .selectFilter(Filter.AssignedType)
        .selectSecondaryFilterAssignedType(FilterAssignedType.Optional)
        .itemExist(FilterAssignedType.Default, false)
        .itemExist(FilterAssignedType.Optional, true)
        .itemExist(FilterAssignedType.None, false);
    });

    //TODO https://github.com/keycloak/keycloak-admin-ui/issues/1959
    it("should filter items by Protocol All", () => {
      listingPage
        .selectFilter(Filter.Protocol)
        .selectSecondaryFilterProtocol(FilterProtocol.All)
        .showNextPageTableItems()
        .itemExist(FilterProtocol.SAML, true)
        .itemExist(openIDConnectItemText, true); //using FilterProtocol.OpenID will fail, text does not match.
    });

    //TODO https://github.com/keycloak/keycloak-admin-ui/issues/1959
    it("should filter items by Protocol SAML", () => {
      listingPage
        .selectFilter(Filter.Protocol)
        .selectSecondaryFilterProtocol(FilterProtocol.SAML)
        .itemExist(FilterProtocol.SAML, true)
        .itemExist(openIDConnectItemText, false); //using FilterProtocol.OpenID will fail, text does not match.
    });

    //TODO https://github.com/keycloak/keycloak-admin-ui/issues/1959
    it("should filter items by Protocol OpenID", () => {
      listingPage
        .selectFilter(Filter.Protocol)
        .selectSecondaryFilterProtocol(FilterProtocol.OpenID)
        .itemExist(FilterProtocol.SAML, false)
        .itemExist(openIDConnectItemText, true); //using FilterProtocol.OpenID will fail, text does not match.
    });

    it("should show items on next page are more than 11", () => {
      listingPage.showNextPageTableItems();
      listingPage.itemsGreaterThan(1);
    });
  });

  describe("Client Scope modify list items", () => {
    const itemName = clientScopeName + 0;
    before(() => {
      keycloakBefore();
      loginPage.logIn();
    });

    beforeEach(() => {
      sidebarPage.goToClientScopes();
    });

    it("should modify selected item type to Default from search bar", () => {
      listingPage
        .clickItemCheckbox(itemName)
        .changeTypeToOfSelectedItems(FilterAssignedType.Default);
      listingPage.itemContainValue(itemName, 2, FilterAssignedType.Default);
    });

    it("should modify selected item type to Optional from search bar", () => {
      listingPage
        .clickItemCheckbox(itemName)
        .changeTypeToOfSelectedItems(FilterAssignedType.Optional);
      listingPage.itemContainValue(itemName, 2, FilterAssignedType.Optional);
    });

    const expectedItemAssignedTypes = [
      FilterAssignedType.Default,
      FilterAssignedType.Optional,
      FilterAssignedType.None,
    ];
    expectedItemAssignedTypes.forEach(($assignedType) => {
      const itemName = clientScopeName + 0;
      it(`should modify item ${itemName} AssignedType to ${$assignedType} from item bar`, () => {
        listingPage
          .searchItem(clientScopeName, false)
          .clickRowSelectItem(itemName, $assignedType);
        // sidebarPage.waitForPageLoad(); //not working
        cy.wait(2000);
        listingPage.searchItem(itemName, false).itemExist($assignedType);
      });
    });

    it("should not allow to modify item AssignedType from search bar when no item selected", () => {
      const itemName = clientScopeName + 0;
      listingPage
        .searchItem(itemName, false)
        .checkInSearchBarChangeTypeToButtonIsDisabled()
        .clickSearchBarActionButton()
        .checkDropdownItemIsDisabled("Delete")
        .clickItemCheckbox(itemName)
        .checkInSearchBarChangeTypeToButtonIsDisabled(false)
        .clickSearchBarActionButton()
        .checkDropdownItemIsDisabled("Delete", false)
        .clickItemCheckbox(itemName)
        .checkInSearchBarChangeTypeToButtonIsDisabled()
        .clickSearchBarActionButton()
        .checkDropdownItemIsDisabled("Delete");
    });

    //TODO: blocked by https://github.com/keycloak/keycloak-admin-ui/issues/1952
    //it("should export item from item bar", () => {

    //});
  });

  describe("Client Scope delete list items ", () => {
    before(() => {
      keycloakBefore();
      loginPage.logIn();
    });

    beforeEach(() => {
      sidebarPage.goToClientScopes();
    });

    //TODO: Partially blocked by https://github.com/keycloak/keycloak-admin-ui/issues/1854
    it("should delete item from item bar", () => {
      listingPage
        .checkInSearchBarChangeTypeToButtonIsDisabled()
        .clickItemCheckbox(clientScopeName + 0)
        .deleteItem(clientScopeName + 0);
      modalUtils
        .checkModalMessage(modalMessageDeleteConfirmation)
        .confirmModal();
      masthead.checkNotificationMessage(
        notificationMessageDeletionConfirmation
      );
      //listingPage.checkInSearchBarChangeTypeToButtonIsDisabled();
    });

    //TODO: Partially blocked by https://github.com/keycloak/keycloak-admin-ui/issues/1854
    it("should delete selected item from search bar", () => {
      listingPage
        .checkInSearchBarChangeTypeToButtonIsDisabled()
        .clickItemCheckbox(clientScopeName + 1)
        .clickSearchBarActionButton()
        .clickSearchBarActionItem("Delete");
      modalUtils
        .checkModalMessage(modalMessageDeleteConfirmation)
        .confirmModal();
      masthead.checkNotificationMessage(
        notificationMessageDeletionConfirmation
      );
      //listingPage.checkInSearchBarChangeTypeToButtonIsDisabled();
    });

    //TODO: Partially blocked by https://github.com/keycloak/keycloak-admin-ui/issues/1854
    it("should delete multiple selected items from search bar", () => {
      listingPage
        .checkInSearchBarChangeTypeToButtonIsDisabled()
        .clickItemCheckbox(clientScopeName + 2)
        .clickItemCheckbox(clientScopeName + 3)
        .clickItemCheckbox(clientScopeName + 4)
        .clickSearchBarActionButton()
        .clickSearchBarActionItem("Delete");
      modalUtils
        .checkModalMessage(modalMessageDeleteConfirmation)
        .confirmModal();
      masthead.checkNotificationMessage(
        notificationMessageDeletionConfirmation
      );
      //listingPage.checkInSearchBarChangeTypeToButtonIsDisabled();
    });
  });

  describe("Client Scope creation", () => {
    before(() => {
      keycloakBefore();
      loginPage.logIn();
    });

    beforeEach(() => {
      sidebarPage.goToClientScopes();
    });

    it("should fail creating client scope", () => {
      sidebarPage.waitForPageLoad();
      listingPage.goToCreateItem();

      createClientScopePage.save().checkClientNameRequiredMessage();

      createClientScopePage
        .fillClientScopeData("address")
        .save()
        .checkClientNameRequiredMessage(false);

      // The error should inform about duplicated name/id
      masthead.checkNotificationMessage(
        "Could not create client scope: 'Client Scope address already exists'"
      );
    });

    it("Client scope CRUD test", () => {
      itemId += "_" + (Math.random() + 1).toString(36).substring(7);

      // Create
      listingPage.itemExist(itemId, false).goToCreateItem();

      createClientScopePage.fillClientScopeData(itemId).save();

      masthead.checkNotificationMessage("Client scope created");

      sidebarPage.goToClientScopes();
      sidebarPage.waitForPageLoad();

      // Delete
      listingPage
        .searchItem(itemId, false)
        .itemExist(itemId)
        .deleteItem(itemId);

      modalUtils
        .checkModalMessage(modalMessageDeleteConfirmation)
        .confirmModal();

      masthead.checkNotificationMessage("The client scope has been deleted");

      listingPage.itemExist(itemId, false);
    });
  });

  describe("Scope test", () => {
    const scopeTab = new RoleMappingTab("client-scope");
    const scopeName = "address";
    it("Assign role", () => {
      const role = "admin";
      listingPage.searchItem(scopeName, false).goToItemDetails(scopeName);
      scopeTab.goToScopeTab().assignRole().selectRow(role).assign();
      masthead.checkNotificationMessage("Role mapping updated");
      scopeTab.checkRoles([role]);
      scopeTab.hideInheritedRoles().selectRow(role).unAssign();
      modalUtils.checkModalTitle("Remove mapping?").confirmModal();
      scopeTab.checkRoles([]);
    });
  });

  describe("Client details - Client scopes subtab", () => {
    const clientScopesTab = new ClientScopesTab();
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
      sidebarPage.goToClients();
      cy.intercept("/admin/realms/master/clients/*").as("fetchClient");
      listingPage.searchItem(clientId).goToItemDetails(clientId);
      cy.wait("@fetchClient");
      clientScopesTab.goToClientScopesTab();
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
      listingPage.itemsGreaterThan(1).itemExist(clientScopeName + 0);
    });

    it("Should search existing client scope by name", () => {
      listingPage
        .searchItem(clientScopeName + 0, false)
        .itemExist(clientScopeName + 0)
        .itemsEqualTo(2);
    });

    it("Should search non-existent client scope by name", () => {
      const itemName = "non-existent-item";
      listingPage.searchItem(itemName, false).checkTableExists(false);
    });

    it("Should search existing client scope by assigned type", () => {
      listingPage
        .selectFilter(Filter.AssignedType)
        .selectSecondaryFilterAssignedType(FilterAssignedType.Default)
        .itemExist(FilterAssignedType.Default)
        .itemExist(FilterAssignedType.Optional, false)
        .selectSecondaryFilterAssignedType(FilterAssignedType.Optional)
        .itemExist(FilterAssignedType.Default, false)
        .itemExist(FilterAssignedType.Optional)
        .selectSecondaryFilterAssignedType(FilterAssignedType.AllTypes)
        .itemExist(FilterAssignedType.Default)
        .itemExist(FilterAssignedType.Optional);
    });

    /*it("Should empty search", () => {

    });*/

    const newItemsWithExpectedAssignedTypes = [
      [clientScopeNameOptionalType, FilterAssignedType.Optional],
      [clientScopeNameDefaultType, FilterAssignedType.Default],
    ];
    newItemsWithExpectedAssignedTypes.forEach(($type) => {
      const [itemName, assignedType] = $type;
      it(`Should add client scope ${itemName} with ${assignedType} assigned type`, () => {
        listingPage.clickPrimaryButton();
        modalUtils.checkModalTitle("Add client scopes to " + clientId);
        listingPage.clickItemCheckbox(itemName);
        modalUtils.confirmModalWithItem(assignedType);
        masthead.checkNotificationMessage("Scope mapping successfully updated");
        listingPage
          .searchItem(itemName, false)
          .itemExist(itemName)
          .itemExist(assignedType);
      });
    });

    const expectedItemAssignedTypes = [
      FilterAssignedType.Optional,
      FilterAssignedType.Default,
    ];
    expectedItemAssignedTypes.forEach(($assignedType) => {
      const itemName = clientScopeName + 0;
      it(`Should change item ${itemName} AssignedType to ${$assignedType} from search bar`, () => {
        listingPage
          .searchItem(itemName, false)
          .clickItemCheckbox(itemName)
          .changeTypeToOfSelectedItems($assignedType);
        masthead.checkNotificationMessage("Scope mapping updated");
        listingPage.searchItem(itemName, false).itemExist($assignedType);
      });
    });

    it("Should show items on next page are more than 11", () => {
      listingPage.showNextPageTableItems().itemsGreaterThan(1);
    });

    it("Should remove client scope from item bar", () => {
      const itemName = clientScopeName + 0;
      listingPage.searchItem(itemName, false).removeItem(itemName);
      masthead.checkNotificationMessage(msgScopeMappingRemoved);
      listingPage.searchItem(itemName, false).checkTableExists(false);
    });

    /*it("Should remove client scope from search bar", () => {
      //covered by next test
    });*/

    // TODO: https://github.com/keycloak/keycloak-admin-ui/issues/1854
    it("Should remove multiple client scopes from search bar", () => {
      const itemName1 = clientScopeName + 1;
      const itemName2 = clientScopeName + 2;
      listingPage
        .clickSearchBarActionButton()
        .checkDropdownItemIsDisabled("Remove")
        .searchItem(clientScopeName, false)
        .clickItemCheckbox(itemName1)
        .clickItemCheckbox(itemName2)
        .clickSearchBarActionButton()
        .clickSearchBarActionItem("Remove");
      masthead.checkNotificationMessage(msgScopeMappingRemoved);
      listingPage
        .searchItem(clientScopeName, false)
        .itemExist(itemName1, false)
        .itemExist(itemName2, false)
        .clickSearchBarActionButton();
      //.checkDropdownItemIsDisabled("Remove");
    });

    //TODO: https://github.com/keycloak/keycloak-admin-ui/issues/1874
    /* it("Should show initial items after filtering", () => { 
      listingPage
        .selectFilter(Filter.AssignedType)
        .selectFilterAssignedType(FilterAssignedType.Optional)
        .selectFilter(Filter.Name)
        .itemExist(FilterAssignedType.Default)
        .itemExist(FilterAssignedType.Optional);
    });*/
  });
});
