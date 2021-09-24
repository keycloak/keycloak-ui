const expect = chai.expect;

export default class OrderDialog {
  private manageDisplayOrder = "manageDisplayOrder";
  private list = "manageOrderDataList";

  openDialog() {
    cy.findByTestId(this.manageDisplayOrder).click({ force: true });
    return this;
  }

  moveRowTo(from: string, to: string) {
    cy.findByTestId(from).trigger("dragstart", {
      dataTransfer: new DataTransfer(),
    });

    cy.findByTestId(to).then(($el) => {
      const { x, y } = $el.get(0).getBoundingClientRect();
      cy.wrap($el.get(0)).trigger("drop", {
        clientX: x,
        clientY: y,
      });
    });

    return this;
  }

  clickSave() {
    cy.get("#modal-confirm").click();
    return this;
  }

  checkOrder(providerNames: string[]) {
    cy.get(`[data-testid=${this.list}] li`).should((providers) => {
      expect(providers).to.have.length(providerNames.length);
      for (let index = 0; index < providerNames.length; index++) {
        expect(providers.eq(index)).to.contain(providerNames[index]);
      }
    });
  }
}
