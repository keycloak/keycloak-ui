import React, { useContext, useState } from "react";
import { ClientList } from "./clients/ClientList";
import { DataLoader } from "./components/data-loader/DataLoader";
import { HttpClientContext } from "./http-service/HttpClientContext";
import { Client } from "./clients/client-model";
import { Page, PageSection, Button } from "@patternfly/react-core";
import { Header } from "./PageHeader";
import { PageNav } from "./PageNav";
import { KeycloakContext } from "./auth/KeycloakContext";
import { TableToolbar } from './components/table-toolbar/TableToolbar';

import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  withRouter,
} from "react-router-dom";
import { NewRealmForm } from "./forms/realm/NewRealmForm";

export const App = () => {
  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const httpClient = useContext(HttpClientContext);
  const keycloak = useContext(KeycloakContext);

  const loader = async () => {
    return await httpClient
      ?.doGet('/realms/master/clients', { params: { first, max } })
      .then((r) => r.data as Client[]);
  };

  const clients = () => (
    <DataLoader loader={loader}>
    {(clients) => (
      <TableToolbar
        count={clients!.length}
        first={first}
        max={max}
        onNextClick={(f) => setFirst(f)}
        onPreviousClick={(f) => setFirst(f)}
        onPerPageSelect={(f, m) => {
          setFirst(f);
          setMax(m);
        }}
        toolbarItem={
          <>
            <Button>Create client</Button>
            <Button variant="link">Import client</Button>
          </>
        }
      >
        <ClientList
          clients={clients}
          baseUrl={keycloak!.authServerUrl()!}
        />
      </TableToolbar>
    )}
  </DataLoader>
  );
  return (
    <Page header={<Header />} isManagedSidebar sidebar={<PageNav />}>
      <PageSection variant="light">
        <Router>
          <Switch>
            <Route
              exact
              path="/add-realm"
              component={withRouter(NewRealmForm)}
            ></Route>
            <Route exact path="/" component={withRouter(clients)}></Route>
          </Switch>
        </Router>
      </PageSection>
    </Page>
  );
};
