export default class EventsPage {
  searchEventDrpDwn: string = ".pf-c-dropdown__toggle";
  searchEventDrpDwnBtn: string =
    ".keycloak__user_events_search_selector_dropdown__toggle";
  searchForm: string = ".pf-c-dropdown__menu";
  userIdInputFld: string = "userId-searchField";
  eventTypeDrpDwnFld: string = "event-type-searchField";
  clientInputFld: string = "client-searchField";
  dateFromInputFld: string = "dateFrom-searchField";
  dateToInputFld: string = "dateTo-searchField";
  searchEventsBtn: string = "search-events-btn";
  eventTypeList: string = ".pf-c-form-control";
  eventTypeOption: string = ".pf-c-select__menu-item";
  eventTypeBtn: string = ".pf-c-button.pf-c-select__toggle-button.pf-m-plain";
  eventsPageTitle: string = ".pf-c-title";

  shouldDisplay() {
    cy.get(this.searchEventDrpDwn).should("exist");
  }

  shouldHaveFormFields() {
    cy.get(this.searchEventDrpDwnBtn).click();
    cy.get(this.searchForm).contains("User ID");
    cy.get(this.searchForm).contains("Event type");
    cy.get(this.searchForm).contains("Client");
    cy.get(this.searchForm).contains("Date(from)");
    cy.get(this.searchForm).contains("Date(to)");
    cy.get(this.searchForm).contains("Search events");
  }

  shouldHaveEventTypeOptions() {
    cy.get(this.searchEventDrpDwnBtn).click();
    cy.get(this.eventTypeList).should("exist");
  }

  shouldHaveSearchBtnDisabled() {
    cy.get(this.searchEventDrpDwnBtn).click();
    cy.getId(this.searchEventsBtn).should("have.attr", "disabled");
  }

  shouldHaveSearchBtnEnabled() {
    cy.get(this.searchEventDrpDwnBtn).click();
    cy.getId(this.userIdInputFld).type("11111");
    cy.getId(this.searchEventsBtn).should("not.have.attr", "disabled");
  }

  shouldDoNoResultsSearch() {
    cy.get(this.searchEventDrpDwnBtn).click();
    cy.getId(this.userIdInputFld).type("test");
    cy.getId(this.searchEventsBtn).click();
    cy.get(this.eventsPageTitle).contains("No events logged");
  }
}
