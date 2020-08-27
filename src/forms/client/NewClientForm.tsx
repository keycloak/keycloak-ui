import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  PageSection,
  TextContent,
  FormGroup,
  Form,
  TextInput,
  ActionGroup,
  Button,
  Divider,
  Select,
  SelectVariant,
  SelectOption,
} from "@patternfly/react-core";
import { HttpClientContext } from "../../http-service/HttpClientContext";

export const NewClientForm = () => {
  const httpClient = useContext(HttpClientContext);
  const [data, setData] = useState<any>({});
  const [open, isOpen] = useState(false);
  useEffect(() => {
    (async () => {
      const response = await httpClient?.doGet("/admin/serverinfo");
      setData(response!.data);
    })();
  });
  return (
    <>
      <PageSection variant="light">
        <TextContent>
          <Text component="h1">Create role</Text>
        </TextContent>
      </PageSection>
      <Divider />
      <PageSection variant="light">
        <Form isHorizontal>
          <FormGroup label="Root URL" fieldId="kc-root-url">
            <TextInput type="text" id="kc-root-url" name="kc-root-url" />
          </FormGroup>
          <FormGroup
            isRequired
            label="Valid Redirect URIs"
            fieldId="kc-valid-redirect-uris"
          >
            <TextInput
              isRequired
              type="text"
              id="kc-valid-redirect-uris"
              name="kc-valid-redirect-uris"
            />
          </FormGroup>
          <FormGroup
            label="ID Token Content Encryption Algorithm"
            fieldId="kc-encryption"
          >
            <Select
              onToggle={() => isOpen(!open)}
              variant={SelectVariant.single}
              aria-label="Select Encryption type"
              isOpen={open}
            >
              {data.providers &&
                Object.keys(
                  data.providers["login-protocol"].providers
                ).map((option, index) => (
                  <SelectOption key={index} value={option} />
                ))}
            </Select>
          </FormGroup>
          <ActionGroup>
            <Button variant="primary">Create</Button>
            <Button variant="link">Cancel</Button>
          </ActionGroup>
        </Form>
      </PageSection>
    </>
  );
};
