import React from "react";
import { Page } from "@patternfly/react-core";
import { Meta } from "@storybook/react";

import { MockAdminClient } from "./MockAdminClient";
import { RealmRolesForm } from "../realm-roles/RealmRoleForm";

import rolesMock from "../realm-roles/__tests__/mock-roles.json";
import { MemoryRouter, Route } from "react-router-dom";
import { RolesForm } from "../realm-roles/RealmRoleDetails";

export default {
  title: "Role details tab",
  component: RealmRolesForm,
} as Meta;

export const RoleDetailsExample = () => {
  return (
    <MockAdminClient mock={{ roles: { findOneById: () => rolesMock[0] } }}>
      <MemoryRouter initialEntries={["/roles/1"]}>
        <Route path="/roles/:id">
          <RolesForm activeTab={0} />
        </Route>
      </MemoryRouter>
    </MockAdminClient>
  );
};

export const RoleDetailsNew = () => {
  return (
    <Page>
      <MockAdminClient>
        <RealmRolesForm />
      </MockAdminClient>
    </Page>
  );
};
