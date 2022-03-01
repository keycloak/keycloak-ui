export default class RolesTab {
  private createRoleBtn = "create-role";
  private createRoleEmptyStateBtn = "no-roles-for-this-client-empty-action";
  private actionsDropdown = `[aria-label="Actions"]`;

  private rolesTab = "rolesTab";

  goToRolesTab() {
    cy.findByTestId(this.rolesTab).click();
    return this;
  }

  goToCreateRoleFromToolbar() {
    cy.findByTestId(this.createRoleBtn).click();
    return this;
  }

  goToCreateRoleFromEmptyState() {
    cy.findByTestId(this.createRoleEmptyStateBtn).click();
    return this;
  }

  fillClientRoleData() {
    cy.findByTestId(this.createRoleBtn).click();
    return this;
  }

  clickActionMenu(item: string) {
    cy.get(this.actionsDropdown)
      .click()
      .within(() => {
        cy.findByText(item).click();
      });
    return this;
  }
}
