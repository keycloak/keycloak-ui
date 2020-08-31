import React, { useState, FormEvent } from "react";
import {
  Text,
  PageSection,
  TextContent,
  Divider,
  Wizard,
} from "@patternfly/react-core";
import { Step1 } from "./Step1";
import { Step2 } from "./Step2";
import { ClientRepresentation } from "../../model/client-model";

export const NewClientForm = () => {
  const [client, setClient] = useState<ClientRepresentation>({
    protocol: "",
    clientId: "",
    name: "",
    description: "",
  });

  const handleInputChange = (
    value: string | boolean,
    event: FormEvent<HTMLInputElement>
  ) => {
    const target = event.target;
    const name = (target as HTMLInputElement).name;

    setClient({
      ...client,
      [name]: value,
    });
  };

  const title = "Create client";
  return (
    <>
      <PageSection variant="light">
        <TextContent>
          <Text component="h1">{title}</Text>
        </TextContent>
      </PageSection>
      <Divider />
      <PageSection variant="light">
        <Wizard
          navAriaLabel={`${title} steps`}
          mainAriaLabel={`${title} content`}
          steps={[
            {
              name: "General Settings",
              component: <Step1 onChange={handleInputChange} client={client} />,
            },
            {
              name: "Capability config",
              component: <Step2 onChange={handleInputChange} client={client} />,
              nextButtonText: "Save",
            },
          ]}
          onSave={() => console.log(client)}
        />
      </PageSection>
    </>
  );
};
