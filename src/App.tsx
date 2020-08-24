import React, { useContext, useState } from 'react';

import { ClientList } from './clients/ClientList';
import { DataLoader } from './components/data-loader/DataLoader';
import { HttpClientContext } from './http-service/HttpClientContext';
import { Client } from './clients/client-model';
import { Page, PageSection } from '@patternfly/react-core';
import { Header } from './PageHeader';
import { PageNav } from './PageNav';
import { KeycloakContext } from './auth/KeycloakContext';

export const App = () => {
  const pageSize = 5;
  const [first, setFirst] = useState(0);
  const httpClient = useContext(HttpClientContext);
  const keycloak = useContext(KeycloakContext);

  const loader = async () => {
    return await httpClient
      ?.doGet('/realms/master/clients', { params: { first, max: pageSize } })
      .then((r) => r.data as Client[]);
  };
  return (
    <Page header={<Header />} isManagedSidebar sidebar={<PageNav />}>
      <PageSection variant="light">
        <DataLoader loader={loader}>
          {(clients) => (
            <ClientList
              clients={clients}
              baseUrl={keycloak!.authServerUrl()!}
              page={first / pageSize + 1}
              pageSize={pageSize}
              onNextClick={(page) => setFirst((page - 1) * pageSize)}
              onPreviousClick={(page) => setFirst((page - 1) * pageSize)}
            />
          )}
        </DataLoader>
      </PageSection>
    </Page>
  );
};
