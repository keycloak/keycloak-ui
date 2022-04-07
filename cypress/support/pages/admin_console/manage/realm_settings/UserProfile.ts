export default class UserProfile {
  private userProfileTab = "rs-user-profile-tab";
  private attributesTab = "attributesTab";
  private attributesGroupTab = "attributesGroupTab";
  private jsonEditorTab = "jsonEditorTab";
  private createAttributeButton = "createAttributeBtn";
  private actionsDrpDwn = "actions-dropdown";
  private deleteDrpDwnOption = "deleteDropdownAttributeItem";
  private editDrpDwnOption = "editDropdownAttributeItem";
  private cancelNewAttribute = "attribute-cancel";
  private newAttributeNameInput = "attribute-name";
  private newAttributeDisplayNameInput = "attribute-display-name";
  private saveNewAttributeBtn = "attribute-create";

  goToTab() {
    cy.findByTestId(this.userProfileTab).click();
    return this;
  }

  goToAttributesTab() {
    cy.findByTestId(this.attributesTab).click();
    return this;
  }

  goToAttributesGroupTab() {
    cy.findByTestId(this.attributesGroupTab).click();
    return this;
  }

  goToJsonEditorTab() {
    cy.findByTestId(this.jsonEditorTab).click();
    return this;
  }

  createAttributeButtonClick() {
    cy.findByTestId(this.createAttributeButton).click();
    return this;
  }

  selectDropdown() {
    cy.findByTestId(this.actionsDrpDwn).click();
    return this;
  }

  selectDeleteOption() {
    cy.findByTestId(this.deleteDrpDwnOption).click();
    return this;
  }

  selectEditOption() {
    cy.findByTestId(this.editDrpDwnOption).click();
    return this;
  }

  cancelAttributeCreation() {
    cy.findByTestId(this.cancelNewAttribute).click();
    return this;
  }

  createAttribute(name: string, displayName: string) {
    cy.findByTestId(this.newAttributeNameInput).type(name);
    cy.findByTestId(this.newAttributeDisplayNameInput).type(displayName);
    return this;
  }

  checkElementNotInList(name: string) {
    cy.get('tbody [data-label="name"]').should("not.contain.text", name);
    return this;
  }

  saveAttributeCreation() {
    cy.findByTestId(this.saveNewAttributeBtn).click();
    return this;
  }

  selectElementInList(name: string) {
    cy.get('tbody [data-label="name"]').contains(name).click();
    return this;
  }

  editAttribute(displayName: string) {
    cy.findByTestId(this.newAttributeDisplayNameInput)
      .click()
      .clear()
      .type(displayName);
    return this;
  }
}
