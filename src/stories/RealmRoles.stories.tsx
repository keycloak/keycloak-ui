import React from "react";
import { Meta } from "@storybook/react";
import { Page } from "@patternfly/react-core";
import { RealmRolesSection } from "../realm-roles/RealmRolesSection";

export default {
  title: "Realm roles section",
  component: RealmRolesSection,
} as Meta;

export const view = () => {
  return (
    <Page>
      <RealmRolesSection />
    </Page>
  );
};
