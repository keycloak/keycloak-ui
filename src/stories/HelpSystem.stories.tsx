import React, { useContext } from "react";
import {
  Page,
  PageHeader,
  PageHeaderTools,
  PageHeaderToolsItem,
  Button,
  Divider,
} from "@patternfly/react-core";
import { withTranslation } from "react-i18next";
import { Meta } from "@storybook/react";

import { HelpItem } from "../components/help-enabler/HelpItem";
import {
  Help,
  HelpContext,
  HelpHeader,
} from "../components/help-enabler/HelpHeader";
import { FormPageHeader } from "../components/page-header/FormPageHeader";

export default {
  title: "Help System Example",
  component: HelpHeader,
} as Meta;

export const HelpItems = () => <HelpItem item="storybook" />;

export const FormPageHeaders = () => (
  <Help>
    <ExampleFormPage />
  </Help>
);

const ExampleFormPage = () => {
  const Example = withTranslation("help")(FormPageHeader);
  const { enabled, toggleHelp } = useContext(HelpContext);
  return (
    <>
      <Button onClick={() => toggleHelp()}>
        {enabled ? "Help on" : "No help needed"}
      </Button>
      <Divider />
      <br/>
      <Example titleKey="storybookTitle" subKey="storybookSubTitle" />
    </>
  );
};

export const HelpSystem = () => (
  <Help>
    <HelpSystemTest />
  </Help>
);

const HelpSystemTest = () => {
  const { enabled } = useContext(HelpContext);
  return (
    <Page
      header={
        <PageHeader
          headerTools={
            <PageHeaderTools>
              <PageHeaderToolsItem>
                <HelpHeader />
              </PageHeaderToolsItem>
              <PageHeaderToolsItem>dummy user...</PageHeaderToolsItem>
            </PageHeaderTools>
          }
        />
      }
    >
      Help system is {enabled ? "enabled" : "not on, guess you don't need help"}
    </Page>
  );
};
