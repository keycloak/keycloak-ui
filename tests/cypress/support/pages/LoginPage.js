export default class LoginPage {

    constructor() {
        this.userNameInput = "#username";
        this.passwordInput = "#password";
        this.submitBtn = "#kc-login";

        this.errorText = ".kc-feedback-text";
    }

    isLogInPage() {
        cy.get(this.userNameInput).should('exist');
        cy.url().should('include', '/auth');

        return this;
    }

    logIn(userName = "admin", password = "admin") {
        cy.getCookie("KEYCLOAK_SESSION_LEGACY").then((cookie) => {
            if(!cookie) {
                cy.get(this.userNameInput).type(userName);
                cy.get(this.passwordInput).type(password);
        
                cy.get(this.submitBtn).click();
            }
        });
    }

    checkErrorIsDisplayed() {
        cy.get(this.userDrpDwn).should('exist');

        return this;
    }

    checkErrorMessage(message) {
        cy.get(this.errorText).invoke('text').should('contain', message);

        return this;
    }
}