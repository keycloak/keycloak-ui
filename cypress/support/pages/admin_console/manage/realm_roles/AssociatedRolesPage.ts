export default class AssociatedRolesPage {
  private actionDropdown = "action-dropdown";
  private addRolesDropdownItem = "add-roles";
  private addRoleToolbarButton = "add-role-button";
  private checkbox = "[type=checkbox]";
  private addAssociatedRolesModalButton = "add-associated-roles-button";
  private compositeRoleBadge = "composite-role-badge";
  private filterTypeDropdown = "filter-type-dropdown";
  private filterTypeDropdownItem = "filter-type-dropdown-item";
  private usersPage = "users-page";

  addAssociatedRealmRole() {
    cy.findByTestId(this.actionDropdown).last().click();

    cy.findByTestId(this.addRolesDropdownItem).click();

    cy.get('[data-testid="addAssociatedRole"] td[data-label="Role name"]')
      .contains("create-realm")
      .parent()
      .within(() => {
        cy.get("input").click();
      });
    cy.findByTestId(this.addAssociatedRolesModalButton).contains("Add").click();

    cy.url().should("include", "/associated-roles");

    cy.findByTestId(this.compositeRoleBadge).should(
      "contain.text",
      "Composite"
    );

    return this;
  }

  addAssociatedClientRole() {
    cy.findByTestId(this.addRoleToolbarButton).click();

    cy.findByTestId(this.filterTypeDropdown).click();

    cy.findByTestId(this.filterTypeDropdownItem).click();

    cy.findByTestId(".pf-c-spinner__tail-ball").should("not.exist");

    cy.get('[data-testid="addAssociatedRole"] td[data-label="Role name"]')
      .contains("manage-account")
      .parent()
      .within(() => {
        cy.get("input").click();
      });

    cy.findByTestId(this.addAssociatedRolesModalButton).contains("Add").click();

    cy.contains("Users in role").click();
    cy.findByTestId(this.usersPage).should("exist");
  }
}
