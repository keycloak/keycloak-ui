import React from "react";
import { Meta } from "@storybook/react";
import { RolesForm } from "../realm-roles/RealmRoleDetails";
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  PageSection,
  Tab,
  Tabs,
  TabTitleText,
  TextArea,
  TextInput,
} from "@patternfly/react-core";
import { ViewHeader } from "../components/view-header/ViewHeader";

export default {
  title: "Role details form",
  component: RolesForm,
} as Meta;

export const RolesFormExample = () => {
  return (
    <>
      <ViewHeader titleKey={""} subKey="" />

      <PageSection variant="light">
        <Tabs onSelect={() => {}} isBox>
          <Tab eventKey={0} title={<TabTitleText>{"Details"}</TabTitleText>}>
            <Form isHorizontal onSubmit={() => {}}>
              <FormGroup
                label={"Role name"}
                fieldId="kc-name"
                isRequired
                helperTextInvalid={"Required"}
              >
                <TextInput type="text" id="kc-name" name="name" />
              </FormGroup>
              <FormGroup label={"Description"} fieldId="kc-description">
                <TextArea type="text" id="kc-description" name="description" />
              </FormGroup>
              <ActionGroup>
                <Button variant="primary" type="submit">
                  {"Save"}
                </Button>
                <Button variant="link" onClick={() => {}}>
                  {"Reload"}
                </Button>
              </ActionGroup>
            </Form>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};
