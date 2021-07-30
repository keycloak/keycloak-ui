import LoginPage from "../support/pages/LoginPage";
import SidebarPage from "../support/pages/admin_console/SidebarPage";
import EventsPage from "../support/pages/admin_console/manage/events/EventsPage";
import { keycloakBefore } from "../support/util/keycloak_before";

const loginPage = new LoginPage();
const sidebarPage = new SidebarPage();
const eventsPage = new EventsPage();

describe("Search events test", function () {
  describe("Search events dropdown", function () {
    beforeEach(function () {
      keycloakBefore();
      loginPage.logIn();
      sidebarPage.goToEvents();
    });

    it("Check search dropdown display", () => {
      eventsPage.shouldDisplay();
    });

    it("Check search form fields display", () => {
      eventsPage.shouldHaveFormFields();
    });

    it("Check `search events` button disabled by default", () => {
      eventsPage.shouldHaveSearchBtnDisabled();
    });

    it("Check `search events` button enabled", () => {
      eventsPage.shouldHaveSearchBtnEnabled();
    });

    it("Check search with no results", () => {
      eventsPage.shouldDoNoResultsSearch();
    });
  });
});
