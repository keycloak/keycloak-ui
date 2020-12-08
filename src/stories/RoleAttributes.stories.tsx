import React from "react";
import { Meta } from "@storybook/react";
import { MockAdminClient } from "./MockAdminClient";
import { MemoryRouter, Route } from "react-router-dom";
import rolesMock from "../realm-roles/__tests__/mock-roles.json";
import { RolesForm } from "../realm-roles/RealmRoleDetails";

export default {
  title: "Role attributes tab",
  component: RolesForm,
} as Meta;

export const RoleAttributesExample = () => {
  return (
    <MockAdminClient mock={{ roles: { findOneById: () => rolesMock[0] } }}>
      <MemoryRouter initialEntries={["/roles/1"]}>
        <Route path="/roles/:id">
          <RolesForm activeTab={1} />
        </Route>
      </MemoryRouter>
    </MockAdminClient>
  );
};
