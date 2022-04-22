import LoginPage from "../support/pages/LoginPage";
import CreateClientPage from "../support/pages/admin_console/manage/clients/CreateClientPage";
import adminClient from "../support/util/AdminClient";
import { keycloakBefore } from "../support/util/keycloak_hooks";
import RoleMappingTab from "../support/pages/admin_console/manage/RoleMappingTab";
import InitialAccessTokenTab from "../support/pages/admin_console/manage/clients/tabs/InitialAccessTokenTab";
import AdvancedTab from "../support/pages/admin_console/manage/clients/client_details/tabs/AdvancedTab";
import ClientDetailsPage, {
  ClientsDetailsTab,
} from "../support/pages/admin_console/manage/clients/client_details/ClientDetailsPage";
import CommonPage from "../support/pages/CommonPage";

let itemId = "client_crud";
const loginPage = new LoginPage();
const createClientPage = new CreateClientPage();
const clientDetailsPage = new ClientDetailsPage();
const commonPage = new CommonPage();

describe("Clients test", () => {
  describe("Client creation", () => {
    before(() => {
      keycloakBefore();
      loginPage.logIn();
    });

    it("Should cancel creating client", () => {
      commonPage.sidebar().goToClients();
      commonPage.tableToolbarUtils().createClient();

      createClientPage.continue().checkClientIdRequiredMessage();

      createClientPage
        .fillClientData("")
        .selectClientType("openid-connect")
        .cancel();

      cy.url().should("not.include", "/add-client");
    });

    it("Should check settings elements", () => {
      commonPage.tableToolbarUtils().clickPrimaryButton();
      const clientId = "Test settings";

      createClientPage
        .fillClientData(clientId)
        .continue()
        .checkCapabilityConfigElements()
        .save();

      commonPage
        .masthead()
        .checkNotificationMessage("Client created successfully");
      commonPage.sidebar().waitForPageLoad();

      createClientPage
        .checkCapabilityConfigElements()
        .checkAccessSettingsElements()
        .checkLoginSettingsElements()
        .checkLogoutSettingsElements()
        .deleteClientFromActionDropdown();

      commonPage.modalUtils().confirmModal();
      commonPage.tableUtils().checkRowItemExists(clientId, false);
    });

    it("Should navigate to previous using 'back' button", () => {
      commonPage.tableToolbarUtils().createClient();

      createClientPage.continue().checkClientIdRequiredMessage();

      createClientPage
        .fillClientData("test_client")
        .selectClientType("openid-connect")
        .continue()
        .back()
        .checkGeneralSettingsStepActive();
    });

    it("Should fail creating client", () => {
      commonPage.sidebar().goToClients();
      cy.wait("@load");
      commonPage.tableToolbarUtils().createClient();

      createClientPage.continue().checkClientIdRequiredMessage();

      createClientPage
        .fillClientData("")
        .selectClientType("openid-connect")
        .continue()
        .checkClientIdRequiredMessage();

      createClientPage.fillClientData("account").continue().save();

      // The error should inform about duplicated name/id
      commonPage
        .masthead()
        .checkNotificationMessage(
          "Could not create client: 'Client account already exists'",
          true
        );
    });

    it("Client CRUD test", () => {
      commonPage.sidebar().goToClients();
      itemId += "_" + (Math.random() + 1).toString(36).substring(7);

      // Create
      commonPage.tableUtils().checkRowItemExists(itemId, false);
      commonPage.tableToolbarUtils().clickPrimaryButton();
      createClientPage.cancel();
      commonPage.tableUtils().checkRowItemExists(itemId, false);
      commonPage.tableToolbarUtils().clickPrimaryButton();

      createClientPage
        .selectClientType("openid-connect")
        .fillClientData(itemId)
        .continue()
        .switchClientAuthentication()
        .clickDirectAccess()
        .clickImplicitFlow()
        .clickOAuthDeviceAuthorizationGrant()
        .clickOidcCibaGrant()
        .clickServiceAccountRoles()
        .clickStandardFlow()
        .save();

      commonPage
        .masthead()
        .checkNotificationMessage("Client created successfully", true);

      commonPage.sidebar().goToClients();

      commonPage.tableToolbarUtils().searchItem("John Doe", false);
      commonPage.emptyState().checkIfExists(true);
      commonPage.tableToolbarUtils().searchItem("");
      commonPage.tableUtils().checkRowItemExists("account");
      commonPage.tableToolbarUtils().searchItem(itemId);
      commonPage.tableUtils().checkRowItemExists(itemId);

      // Delete
      commonPage.tableUtils().selectRowItemAction(itemId, "Delete");
      commonPage.sidebar().waitForPageLoad();
      commonPage
        .modalUtils()
        .checkModalTitle(`Delete ${itemId} ?`)
        .confirmModal();
      commonPage
        .masthead()
        .checkNotificationMessage("The client has been deleted", true);
      commonPage.tableUtils().checkRowItemExists(itemId, false);
    });

    it("Initial access token can't be created with 0 days and count", () => {
      commonPage.sidebar().goToClients(false);
      const initialAccessTokenTab = new InitialAccessTokenTab();
      initialAccessTokenTab
        .goToInitialAccessTokenTab()
        .shouldBeEmpty()
        .goToCreateFromEmptyList()
        .fillNewTokenData(0, 0)
        .checkExpirationGreaterThanZeroError()
        .checkCountValue(1)
        .checkSaveButtonIsDisabled();
    });

    it("Initial access token", () => {
      commonPage.sidebar().goToClients(false);
      const initialAccessTokenTab = new InitialAccessTokenTab();
      initialAccessTokenTab
        .goToInitialAccessTokenTab()
        .shouldBeEmpty()
        .goToCreateFromEmptyList()
        .fillNewTokenData(1, 3)
        .save();

      commonPage
        .modalUtils()
        .checkModalTitle("Initial access token details")
        .closeModal();

      commonPage
        .masthead()
        .checkNotificationMessage("New initial access token has been created");

      initialAccessTokenTab.shouldNotBeEmpty();

      commonPage.tableToolbarUtils().searchItem("John Doe", false);
      commonPage.emptyState().checkIfExists(true);
      commonPage.tableToolbarUtils().searchItem("", false);

      initialAccessTokenTab.getFirstId((id) => {
        commonPage
          .tableUtils()
          .checkRowItemValueByItemName(id, 4, "4")
          .checkRowItemValueByItemName(id, 5, "4")
          .checkRowItemExists(id);
      });

      commonPage.tableToolbarUtils().clickPrimaryButton("Create");
      initialAccessTokenTab.fillNewTokenData(1, 3).save();

      commonPage.modalUtils().closeModal();

      initialAccessTokenTab.getFirstId((id) => {
        commonPage.tableUtils().selectRowItemAction(id, "Delete");
        commonPage.sidebar().waitForPageLoad();
        commonPage
          .modalUtils()
          .checkModalTitle("Delete initial access token?")
          .confirmModal();
      });

      commonPage
        .masthead()
        .checkNotificationMessage("Initial access token deleted successfully");
      initialAccessTokenTab.shouldNotBeEmpty();

      initialAccessTokenTab.getFirstId((id) => {
        commonPage.tableUtils().selectRowItemAction(id, "Delete");
        commonPage.sidebar().waitForPageLoad();
        commonPage.modalUtils().confirmModal();
      });
      initialAccessTokenTab.shouldBeEmpty();
    });
  });

  describe("Advanced tab test", () => {
    const advancedTab = new AdvancedTab();
    let client: string;

    before(() => {
      keycloakBefore();
      loginPage.logIn();
    });

    beforeEach(() => {
      commonPage.sidebar().goToClients();
      client = "client_" + (Math.random() + 1).toString(36).substring(7);
      commonPage.tableToolbarUtils().createClient();
      createClientPage
        .selectClientType("openid-connect")
        .fillClientData(client)
        .continue();

      commonPage.sidebar().waitForPageLoad();

      createClientPage.save();

      clientDetailsPage.goToAdvancedTab();
    });

    afterEach(() => {
      adminClient.deleteClient(client);
    });

    it("Clustering", () => {
      advancedTab.expandClusterNode();

      advancedTab.registerNodeManually().fillHost("localhost").saveHost();
      advancedTab.checkTestClusterAvailability(true);
    });

    it("Fine grain OpenID connect configuration", () => {
      const algorithm = "ES384";
      advancedTab
        .selectAccessTokenSignatureAlgorithm(algorithm)
        .saveFineGrain();

      advancedTab
        .selectAccessTokenSignatureAlgorithm("HS384")
        .revertFineGrain();
      advancedTab.checkAccessTokenSignatureAlgorithm(algorithm);
    });
  });

  describe("Service account tab test", () => {
    const serviceAccountTab = new RoleMappingTab("user");
    const serviceAccountName = "service-account-client";

    before(() => {
      keycloakBefore();
      loginPage.logIn();
      adminClient.createClient({
        protocol: "openid-connect",
        clientId: serviceAccountName,
        publicClient: false,
        authorizationServicesEnabled: true,
        serviceAccountsEnabled: true,
        standardFlowEnabled: true,
      });
    });

    beforeEach(() => {
      commonPage.sidebar().goToClients();
    });

    after(() => {
      adminClient.deleteClient(serviceAccountName);
    });

    it("List", () => {
      commonPage.tableToolbarUtils().searchItem(serviceAccountName);
      commonPage.tableUtils().clickRowItemLink(serviceAccountName);
      serviceAccountTab
        .goToServiceAccountTab()
        .checkRoles(["manage-account", "offline_access", "uma_authorization"]);
    });

    it.skip("Assign", () => {
      commonPage.tableUtils().clickRowItemLink(serviceAccountName);
      serviceAccountTab
        .goToServiceAccountTab()
        .assignRole(false)
        .selectRow("create-realm")
        .assign();
      commonPage.masthead().checkNotificationMessage("Role mapping updated");
      serviceAccountTab.selectRow("create-realm").unAssign();
      commonPage.sidebar().waitForPageLoad();
      commonPage.modalUtils().checkModalTitle("Remove mapping?").confirmModal();
      commonPage
        .masthead()
        .checkNotificationMessage("Scope mapping successfully removed");
    });
  });

  describe("Mapping tab", () => {
    const mappingClient = "mapping-client";
    beforeEach(() => {
      keycloakBefore();
      loginPage.logIn();
      commonPage.sidebar().goToClients();
      commonPage.tableToolbarUtils().searchItem(mappingClient);
      commonPage.tableUtils().clickRowItemLink(mappingClient);
    });

    before(() => {
      adminClient.createClient({
        protocol: "openid-connect",
        clientId: mappingClient,
        publicClient: false,
      });
    });

    after(() => {
      adminClient.deleteClient(mappingClient);
    });

    it("Add mapping to openid client", () => {
      clientDetailsPage
        .goToClientScopesTab()
        .clickDedicatedScope(mappingClient)
        .goToMappersTab()
        .addPredefinedMapper();
      clientDetailsPage.modalUtils().table().clickHeaderItem(1, "input");
      clientDetailsPage.modalUtils().add();
      clientDetailsPage
        .masthead()
        .checkNotificationMessage("Mapping successfully created");
    });
  });

  describe("Keys tab test", () => {
    const keysName = "keys-client";

    before(() => {
      keycloakBefore();
      loginPage.logIn();
      adminClient.createClient({
        protocol: "openid-connect",
        clientId: keysName,
        publicClient: false,
      });
    });

    beforeEach(() => {
      commonPage.sidebar().goToClients();
      commonPage.tableToolbarUtils().searchItem(keysName);
      commonPage.tableUtils().clickRowItemLink(keysName);
    });

    after(() => {
      adminClient.deleteClient(keysName);
    });

    it("Change use JWKS Url", () => {
      const keysTab = clientDetailsPage.goToKeysTab();
      keysTab.formUtils().checkSaveButtonIsDisabled(true);
      keysTab.toggleUseJwksUrl().formUtils().checkSaveButtonIsDisabled(false);
    });

    it("Generate new keys", () => {
      const keysTab = clientDetailsPage.goToKeysTab();
      keysTab.clickGenerate();
      keysTab.fillGenerateModal("keyname", "123", "1234").clickConfirm();

      commonPage
        .masthead()
        .checkNotificationMessage(
          "New key pair and certificate generated successfully"
        );
    });
  });

  describe("Realm client", () => {
    const clientName = "master-realm";

    before(() => {
      keycloakBefore();
      loginPage.logIn();
      commonPage.sidebar().goToClients();
      commonPage.tableToolbarUtils().searchItem(clientName);
      commonPage.tableUtils().clickRowItemLink(clientName);
    });

    it("Displays the correct tabs", () => {
      clientDetailsPage
        .goToSettingsTab()
        .tabUtils()
        .checkTabExists(ClientsDetailsTab.Settings, true)
        .checkTabExists(ClientsDetailsTab.Roles, true)
        .checkTabExists(ClientsDetailsTab.Advanced, true)
        .checkNumberOfTabsIsEqual(4);
    });

    it("Hides the delete action", () => {
      commonPage
        .actionToolbarUtils()
        .clickActionToggleButton()
        .checkActionItemExists("Delete", false);
    });
  });

  describe("Bearer only", () => {
    const clientId = "bearer-only";

    before(() => {
      keycloakBefore();
      loginPage.logIn();
      adminClient.createClient({
        clientId,
        protocol: "openid-connect",
        publicClient: false,
        bearerOnly: true,
      });
      commonPage.sidebar().goToClients();
      cy.intercept("/admin/realms/master/clients/*").as("fetchClient");
      commonPage.tableToolbarUtils().searchItem(clientId);
      commonPage.tableUtils().clickRowItemLink(clientId);
      cy.wait("@fetchClient");
    });

    after(() => {
      adminClient.deleteClient(clientId);
    });

    it("Shows an explainer text for bearer only clients", () => {
      commonPage
        .actionToolbarUtils()
        .bearerOnlyExplainerLabelElement.trigger("mouseenter");
      commonPage
        .actionToolbarUtils()
        .bearerOnlyExplainerTooltipElement.should("exist");
    });

    it("Hides the capability config section", () => {
      cy.findByTestId("capability-config-form").should("not.exist");
      cy.findByTestId("jump-link-capability-config").should("not.exist");
    });
  });
});
