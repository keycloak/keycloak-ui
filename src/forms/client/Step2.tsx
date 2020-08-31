import { Form, FormGroup, Switch, Checkbox } from "@patternfly/react-core";
import React, { FormEvent } from "react";
import { ClientRepresentation } from "../../model/client-model";

type Step2Props = {
  onChange: (value: string | boolean, event: FormEvent<HTMLInputElement>) => void;
  client: ClientRepresentation;
};

export const Step2 = ({client, onChange}: Step2Props) => (
  <Form isHorizontal>
    <FormGroup label="Client authentication" fieldId="kc-authentication">
      <Switch
        id="kc-authentication"
        name="authentication"
        label="ON"
        labelOff="OFF"
        isChecked={client.authentication}
        onChange={onChange}
      />
    </FormGroup>
    <FormGroup label="Authentication" fieldId="kc-authorisation">
      <Switch
        id="kc-authorisation"
        name="authorisation"
        label="ON"
        labelOff="OFF"
        isChecked={client.authorisation}
        onChange={onChange}
      />
    </FormGroup>
    <FormGroup label="Authentication flow" fieldId="kc-flow">
      <Checkbox
        label="Standard flow"
        aria-label="Enable standard flow"
        id="kc-flow-standard"
        name="standardFlowEnabled"
        isChecked={client.standardFlowEnabled}
        onChange={onChange}
      />
      <Checkbox
        label="Direct access"
        aria-label="Enable Direct access"
        id="kc-flow-direct"
        name="directAccessGrantsEnabled"
        isChecked={client.directAccessGrantsEnabled}
        onChange={onChange}
      />
      <Checkbox
        label="Implicid flow"
        aria-label="Enable implicid flow"
        id="kc-flow-implicid"
        name="implicitFlowEnabled"
        isChecked={client.implicitFlowEnabled}
        onChange={onChange}
      />
      <Checkbox
        label="Service account"
        aria-label="Enable service account"
        id="kc-flow-service-account"
        name="serviceAccount"
        isChecked={client.serviceAccount}
        onChange={onChange}
      />
    </FormGroup>
  </Form>
);