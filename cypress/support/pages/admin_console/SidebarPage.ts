export default class SidebarPage {
  private realmsDrpDwn = '[data-testid="realmSelectorToggle"]';
  private realmsList = "#realm-select ul";
  private createRealmBtn = "add-realm";

  private clientsBtn = "#nav-item-clients";
  private clientScopesBtn = "#nav-item-client-scopes";
  private realmRolesBtn = "#nav-item-roles";
  private usersBtn = "#nav-item-users";
  private groupsBtn = "#nav-item-groups";
  private sessionsBtn = "#nav-item-sessions";
  private eventsBtn = "#nav-item-events";

  private realmSettingsBtn = "#nav-item-realm-settings";
  private authenticationBtn = "#nav-item-authentication";
  private identityProvidersBtn = "#nav-item-identity-providers";
  private userFederationBtn = "#nav-item-user-federation";

  getCurrentRealm() {
    return cy.get(this.realmsDrpDwn).scrollIntoView().invoke("text");
  }

  goToRealm(realmName: string) {
    this.waitForPageLoad();
    cy.get(this.realmsDrpDwn).scrollIntoView().click({ force: true });
    cy.get(this.realmsList).contains(realmName).click({ force: true });
    this.waitForPageLoad();

    return this;
  }

  goToCreateRealm() {
    this.waitForPageLoad();
    cy.get(this.realmsDrpDwn).scrollIntoView().click({ force: true });
    cy.findByTestId(this.createRealmBtn).click({ force: true });
    this.waitForPageLoad();

    return this;
  }

  goToClients() {
    cy.get(this.clientsBtn).scrollIntoView().click({ force: true });

    return this;
  }

  goToClientScopes() {
    cy.get(this.clientScopesBtn).scrollIntoView().click();

    return this;
  }

  goToRealmRoles() {
    cy.get(this.realmRolesBtn).click();

    return this;
  }

  goToUsers() {
    cy.get(this.usersBtn).click();

    return this;
  }

  goToGroups() {
    cy.get(this.groupsBtn).click();

    return this;
  }

  goToSessions() {
    cy.get(this.sessionsBtn).click();

    return this;
  }

  goToEvents() {
    cy.get(this.eventsBtn).click();

    return this;
  }

  goToRealmSettings() {
    cy.get(this.realmSettingsBtn).click({ force: true });
    this.waitForPageLoad();

    return this;
  }

  goToAuthentication() {
    cy.get(this.authenticationBtn).click();

    return this;
  }

  goToIdentityProviders() {
    cy.get(this.identityProvidersBtn).click();

    return this;
  }

  goToUserFederation() {
    cy.get(this.userFederationBtn).click();
    this.waitForPageLoad();

    return this;
  }

  waitForPageLoad() {
    cy.get('[role="progressbar"]').should("not.exist");
    return this;
  }
}
