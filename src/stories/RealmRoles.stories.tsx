import React from "react";
import { Meta } from "@storybook/react";
import { Page } from "@patternfly/react-core";
// import { NewRealmForm } from "../realm/add/NewRealmForm";
import { RolesList } from "../realm-roles/RoleList";
import rolesMock from "../clients/__tests__/mock-clients.json";
import { RoleRepresentation } from "../model/role-model";

export default {
  title: "Roles List",
  component: RolesList,
} as Meta;

export const RolesListExample = () => <RolesList roles={rolesMock} />;
