import { RequiredActionAlias } from "keycloak-admin/lib/defs/requiredActionProviderRepresentation";

export default class UserDetailsPage {
    saveBtn: string;
    cancelBtn: string;
    emailInput: string;
    emailValue: string;
    firstNameInput: string;
    firstNameValue: string;
    lastNameInput: string;
    lastNameValue: string;
    enabledSwitch: string;
    enabledValue: boolean
    requiredUserActions: RequiredActionAlias[];
  
    constructor() {
      this.saveBtn = "[data-testid=save-user]";
      this.cancelBtn = "[data-testid=cancel-create-user]";
      this.emailInput = "[data-testid=email-input]"
      this.emailValue = "example" + "_" + (Math.random() + 1).toString(36).substring(7) + "@example.com";
      this.firstNameInput = "[data-testid=firstName-input]"
      this.firstNameValue = "firstname";
      this.lastNameInput = "[data-testid=lastName-input]"
      this.lastNameValue = "lastname";
      this.enabledSwitch = "[data-testid=user-enabled-switch]"
      this.enabledValue = true;
      this.requiredUserActions = [RequiredActionAlias.UPDATE_PASSWORD]
    }
  
    
    fillUserData() {
  
    cy.get(this.emailInput).type(this.emailValue);
    cy.get(this.firstNameInput).type(this.firstNameValue);
    cy.get(this.lastNameInput).type(this.lastNameValue);
    cy.get(this.enabledSwitch).check({ force: true });

  
      return this;
    }
  
    save() {
      cy.get(this.saveBtn).click();
  
      return this;
    }
  
    cancel() {
      cy.get(this.cancelBtn).click();
  
      return this;
    }
  }
  