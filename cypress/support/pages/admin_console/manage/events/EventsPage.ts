export default class SessionsPage {
  searchEventDrpDwn: string;
  searchEventDrpDwnBtn: string;
  searchForm: string;
  userIdInputFld: string;
  eventTypeDrpDwnFld: string;
  clientInputFld: string;
  dateFromInputFld: string;
  dateToInputFld: string;
  searchEventsBtn: string;
  eventTypeList: string;
  eventsPageTitle: string;

  constructor() {
    this.searchEventDrpDwn = ".pf-c-dropdown__toggle";
    this.searchEventDrpDwnBtn =
      ".keycloak__user_events_search_selector_dropdown__toggle";
    this.searchForm = ".pf-c-dropdown__menu";
    this.userIdInputFld = "userId-searchField";
    this.eventTypeDrpDwnFld = "event-type-searchField";
    this.clientInputFld = "client-searchField";
    this.dateFromInputFld = "dateFrom-searchField";
    this.dateToInputFld = "dateTo-searchField";
    this.searchEventsBtn = "search-events-btn";
    this.eventTypeList = ".pf-c-form-control";
    this.eventsPageTitle = ".pf-c-title";
  }

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

    return this;
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
