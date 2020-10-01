import React from "react";
import { Page } from "@patternfly/react-core";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import { Header } from "./PageHeader";
import { PageNav } from "./PageNav";
import { Help } from "./components/help-enabler/HelpHeader";

import { RealmContextProvider } from "./components/realm-context/RealmContext";
import { WhoAmIContextProvider } from "./whoami/WhoAmI";

import { routes } from "./route-config";
import { PageBreadCrumbs } from "./components/bread-crumb/PageBreadCrumbs";

export const App = () => {
  return (
    <Router>
      <WhoAmIContextProvider>
        <RealmContextProvider>
          <Help>
<<<<<<< HEAD
            <Page
              header={<Header />}
              isManagedSidebar
              sidebar={<PageNav />}
              breadcrumb={<PageBreadCrumbs />}
            >
              <Switch>
                {routes(() => {}).map((route, i) => (
                  <Route key={i} {...route} exact />
                ))}
=======
            <Page header={<Header />} isManagedSidebar sidebar={<PageNav />}>
              <Switch>
                <Route exact path="/add-realm" component={NewRealmForm}></Route>
                <Route exact path="/add-role" component={NewRoleForm}></Route>
                <Route exact path="/clients" component={ClientsSection}></Route>
                <Route
                  exact
                  path="/client-settings/:id"
                  component={ClientSettings}
                ></Route>
                <Route
                  exact
                  path="/add-client"
                  component={NewClientForm}
                ></Route>
                <Route
                  exact
                  path="/import-client"
                  component={ImportForm}
                ></Route>

                <Route
                  exact
                  path="/client-scopes"
                  component={ClientScopesSection}
                ></Route>
                <Route
                  exact
                  path="/add-client-scopes"
                  component={NewClientScopeForm}
                ></Route>
                <Route
                  exact
                  path="/realm-roles"
                  component={RealmRolesSection}
                ></Route>
                <Route exact path="/users" component={UsersSection}></Route>
                <Route exact path="/groups" component={GroupsSection}></Route>
                <Route
                  exact
                  path="/sessions"
                  component={SessionsSection}
                ></Route>
                <Route exact path="/events" component={EventsSection}></Route>

                <Route
                  exact
                  path="/realm-settings"
                  component={RealmSettingsSection}
                ></Route>
                <Route
                  exact
                  path="/authentication"
                  component={AuthenticationSection}
                ></Route>
                <Route
                  exact
                  path="/identity-providers"
                  component={IdentityProvidersSection}
                ></Route>
                <Route
                  exact
                  path="/user-federation"
                  component={UserFederationSection}
                ></Route>

                <Route exact path="/" component={ClientsSection} />
                <Route component={PageNotFoundSection} />
>>>>>>> Fix formatting
              </Switch>
            </Page>
          </Help>
        </RealmContextProvider>
      </WhoAmIContextProvider>
    </Router>
  );
};
