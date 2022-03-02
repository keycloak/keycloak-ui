export default class ClientRolesTab {
  private createRoleBtn = "create-role";
  private createRoleEmptyStateBtn = "no-roles-for-this-client-empty-action";
  private actionsDropdown = `[aria-label="Actions"]`;
  private hideInheritedRolesChkBox = "#kc-hide-inherited-roles-checkbox";

  private rolesTab = "rolesTab";
  private associatedRolesTab = ".kc-associated-roles-tab > button";

  goToRolesTab() {
    cy.findByTestId(this.rolesTab).click();
    return this;
  }

  goToAssociatedRolesTab() {
    cy.get(this.associatedRolesTab).click();
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

  hideInheritedRoles() {
    cy.get(this.hideInheritedRolesChkBox).check();
    return this;
  }
}
