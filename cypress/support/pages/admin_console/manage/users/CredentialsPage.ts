export default class CredentialsPage {
  credentialsTab: string;

  emptyStatePasswordBtn: string;
  emptyStateResetBtn: string;
  resetBtn: string;
  setPasswordBtn: string;
  credentialResetModal: string;
  resetModalActionsToggleBtn: string;
  passwordField: string;
  passwordConfirmationField: string;
  resetActions: string[];
  confirmationButton: string;

  constructor() {
    this.credentialsTab = "credentials";
    this.emptyStatePasswordBtn = "no-credentials-empty-action";
    this.emptyStateResetBtn = "credential-reset-empty-action";
    this.resetBtn = "credentialResetBtn";
    this.setPasswordBtn = "setPasswordBtn";
    this.credentialResetModal = "credential-reset-modal";
    this.resetModalActionsToggleBtn =
      "[data-testid=credential-reset-modal] #actions";
    this.passwordField =
      ".kc-password > .pf-c-input-group > .pf-c-form-control";
    this.passwordConfirmationField =
      ".kc-passwordConfirmation > .pf-c-input-group > .pf-c-form-control";
    this.resetActions = [
      "VERIFY_EMAIL-option",
      "UPDATE_PROFILE-option",
      "CONFIGURE_TOTP-option",
      "UPDATE_PASSWORD-option",
      "terms_and_conditions-option",
    ];
    this.confirmationButton = "okBtn";
  }

  goToCredentialsTab() {
    cy.findByTestId(this.credentialsTab).click();

    return this;
  }
  clickEmptyStatePasswordBtn() {
    cy.findByTestId(this.emptyStatePasswordBtn).click();

    return this;
  }

  clickEmptyStateResetBtn() {
    cy.findByTestId(this.emptyStateResetBtn).click();

    return this;
  }

  clickResetBtn() {
    cy.findByTestId(this.resetBtn).click();

    return this;
  }

  clickResetModalActionsToggleBtn() {
    cy.get(this.resetModalActionsToggleBtn).click();

    return this;
  }

  clickResetModalAction(index: number) {
    cy.findByTestId(this.resetActions[index]).click();

    return this;
  }

  clickConfirmationBtn() {
    cy.findByTestId(this.confirmationButton).dblclick();

    return this;
  }

  fillPasswordForm() {
    cy.get(this.passwordField).type("test");
    cy.get(this.passwordConfirmationField).type("test");

    return this;
  }

  fillResetCredentialForm() {
    cy.findByTestId(this.credentialResetModal);
    this.clickResetModalActionsToggleBtn()
      .clickResetModalAction(2)
      .clickResetModalAction(3)
      .clickConfirmationBtn();

    return this;
  }

  clickSetPasswordBtn() {
    cy.findByTestId(this.setPasswordBtn).click();

    return this;
  }
}
