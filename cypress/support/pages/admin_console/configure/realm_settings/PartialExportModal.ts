export default class PartialExportModal {
  open() {
    cy.findByTestId("openPartialExportModal").click();
  }

  exportButton() {
    return cy.findByTestId("export-button");
  }

  cancelButton() {
    return cy.findByTestId("cancel-button");
  }

  includeGroupsAndRolesSwitch() {
    return cy.findByTestId("include-groups-and-roles-switch");
  }

  includeClientsSwitch() {
    return cy.findByTestId("include-clients-switch");
  }

  warningMessage() {
    return cy.findByTestId("warning-message");
  }
}
