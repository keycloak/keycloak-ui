import React from "react";
import { Meta } from "@storybook/react";
import { Page } from "@patternfly/react-core";
import { RoleAttributes } from "../realm-roles/RoleAttributes";
import { useForm } from "react-hook-form";

export default {
  title: "Role attributes tab",
  component: RoleAttributes,
} as Meta;



export const RoleAttributesExample = () => {

    const form = useForm();

  return (
    <Page>
      <RoleAttributes form={form} save={() => {}} />
    </Page>
  );
};
