import React from "react";
import { Page, PageSection } from "@patternfly/react-core";
import { Header } from "./PageHeader";
import { PageNav } from "./PageNav";

import { Help } from "./components/help-enabler/HelpHeader";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { NewRealmForm } from "./realm/add/NewRealmForm";
import { NewClientForm } from "./clients/add/NewClientForm";
import { ImportForm } from "./clients/import/ImportForm";
import { ClientsPage } from "./clients/ClientsPage";
import { ClientScopesPage } from "./client-scopes/ClientScopesPage";
import { RealmRolesPage } from "./realm-roles/RealmRolesPage";
import { UsersPage } from "./user/UsersPage";
import { GroupsPage } from "./groups/GroupsPage";
import { SessionsPage } from "./sessions/SessionsPage";
import { EventsPage } from "./events/EventsPage";
import { RealmSettingsPage } from "./realm-settings/RealmSettingsPage";
import { AuthenticationPage } from "./authentication/AuthenticationPage";
import { IdentityProvidersPage } from "./identity-providers/IdentityProvidersPage";
import { UserFederationPage } from "./user-federation/UserFederationPage";

import { PageNotFoundPage } from "./PageNotFoundPage";

export const App = () => {
  return (
    <Router>
      <Help>
        <Page header={<Header />} isManagedSidebar sidebar={<PageNav />}>
          <PageSection variant="light">
            <Switch>
              <Route exact path="/add-realm" component={NewRealmForm}></Route>

              <Route exact path="/clients" component={ClientsPage}></Route>
              <Route exact path="/add-client" component={NewClientForm}></Route>
              <Route exact path="/import-client" component={ImportForm}></Route>

              <Route
                exact
                path="/client-scopes"
                component={ClientScopesPage}
              ></Route>
              <Route
                exact
                path="/realm-roles"
                component={RealmRolesPage}
              ></Route>
              <Route exact path="/users" component={UsersPage}></Route>
              <Route exact path="/groups" component={GroupsPage}></Route>
              <Route exact path="/sessions" component={SessionsPage}></Route>
              <Route exact path="/events" component={EventsPage}></Route>

              <Route
                exact
                path="/realm-settings"
                component={RealmSettingsPage}
              ></Route>
              <Route
                exact
                path="/authentication"
                component={AuthenticationPage}
              ></Route>
              <Route
                exact
                path="/identity-providers"
                component={IdentityProvidersPage}
              ></Route>
              <Route
                exact
                path="/user-federation"
                component={UserFederationPage}
              ></Route>

              <Route exact path="/" component={ClientsPage} />
              <Route component={PageNotFoundPage} />
            </Switch>
          </PageSection>
        </Page>
      </Help>
    </Router>
  );
};
