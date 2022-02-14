export default class ModalUtils {
  private modalTitle = ".pf-c-modal-box .pf-c-modal-box__title-text";
  private modalMessage = ".pf-c-modal-box .pf-c-modal-box__body";

  private confirmModalBtn = "confirm";
  private cancelModalBtn = "cancel";
  private closeModalBtn = ".pf-c-modal-box .pf-m-plain";
  private copyToClipboardBtn = '[id*="copy-button"]';
  private progressBar = '[role="progressbar"]';

  confirmModal(force = false) {
    cy.findByTestId(this.confirmModalBtn).click({ force });

    return this;
  }

  checkConfirmButtonText(text: string) {
    cy.findByTestId(this.confirmModalBtn).contains(text);

    return this;
  }

  cancelModal(force = false) {
    cy.findByTestId(this.cancelModalBtn).click({ force });

    return this;
  }

  cancelButtonContains(text: string) {
    cy.findByTestId(this.cancelModalBtn).contains(text);

    return this;
  }

  copyToClipboard() {
    cy.get(this.copyToClipboardBtn).click();

    return this;
  }

  closeModal(force = false) {
    cy.get(this.closeModalBtn).click({ force });

    return this;
  }

  checkModalTitle(title: string) {
    cy.get(this.modalTitle).invoke("text").should("eq", title);

    return this;
  }

  checkModalMessage(message: string) {
    cy.get(this.modalMessage).invoke("text").should("eq", message);

    return this;
  }
}
