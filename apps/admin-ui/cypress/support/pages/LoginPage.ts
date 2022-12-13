export default class LoginPage {
  private userNameInput = "#username";
  private passwordInput = "#password";
  private submitBtn = "#kc-login";
  private userDrpDwn = "#user-dropdown";

  private errorText = ".kc-feedback-text";

  isLogInPage() {
    cy.get(this.userNameInput).should("exist");
    cy.url().should("include", "/auth");

    return this;
  }

  logIn(userName = "admin", password = "admin") {
    cy.session([userName, password], () => {
      cy.visit("");
      cy.get(this.userNameInput).type(userName);
      cy.get(this.passwordInput).type(password);
      cy.get(this.submitBtn).click();
    });
    cy.visit("");
  }

  checkErrorIsDisplayed() {
    cy.get(this.userDrpDwn).should("exist");

    return this;
  }

  checkErrorMessage(message: string) {
    cy.get(this.errorText).invoke("text").should("contain", message);

    return this;
  }
}
