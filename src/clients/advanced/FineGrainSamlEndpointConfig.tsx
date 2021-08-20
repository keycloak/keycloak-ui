import React from "react";
import { useTranslation } from "react-i18next";
import type { Control } from "react-hook-form";
import {
  ActionGroup,
  Button,
  FormGroup,
  TextInput,
} from "@patternfly/react-core";

import { FormAccess } from "../../components/form-access/FormAccess";
import { HelpItem } from "../../components/help-enabler/HelpItem";

type FineGrainSamlEndpointConfigProps = {
  control: Control<Record<string, any>>;
  save: () => void;
  reset: () => void;
};

export const FineGrainSamlEndpointConfig = ({
  control: { register },
  save,
  reset,
}: FineGrainSamlEndpointConfigProps) => {
  const { t } = useTranslation("clients");
  return (
    <FormAccess role="manage-realm" isHorizontal>
      <FormGroup
        label={t("assertionConsumerServicePostBindingURL")}
        fieldId="assertionConsumerServicePostBindingURL"
        labelIcon={
          <HelpItem
            helpText="clients-help:assertionConsumerServicePostBindingURL"
            forLabel={t("assertionConsumerServicePostBindingURL")}
            forID="assertionConsumerServicePostBindingURL"
          />
        }
      >
        <TextInput
          ref={register()}
          type="text"
          id="assertionConsumerServicePostBindingURL"
          name="attributes.saml.assertion.consumer.url.post"
        />
      </FormGroup>
      <FormGroup
        label={t("assertionConsumerServiceRedirectBindingURL")}
        fieldId="assertionConsumerServiceRedirectBindingURL"
        labelIcon={
          <HelpItem
            helpText="clients-help:assertionConsumerServiceRedirectBindingURL"
            forLabel={t("assertionConsumerServiceRedirectBindingURL")}
            forID="assertionConsumerServiceRedirectBindingURL"
          />
        }
      >
        <TextInput
          ref={register()}
          type="text"
          id="assertionConsumerServiceRedirectBindingURL"
          name="attributes.saml.assertion.consumer.url.redirect"
        />
      </FormGroup>
      <FormGroup
        label={t("logoutServicePostBindingURL")}
        fieldId="logoutServicePostBindingURL"
        labelIcon={
          <HelpItem
            helpText="clients-help:logoutServicePostBindingURL"
            forLabel={t("logoutServicePostBindingURL")}
            forID="logoutServicePostBindingURL"
          />
        }
      >
        <TextInput
          ref={register()}
          type="text"
          id="logoutServicePostBindingURL"
          name="attributes.saml.single.logout.service.url.post"
        />
      </FormGroup>
      <FormGroup
        label={t("logoutServiceRedirectBindingURL")}
        fieldId="logoutServiceRedirectBindingURL"
        labelIcon={
          <HelpItem
            helpText="clients-help:logoutServiceRedirectBindingURL"
            forLabel={t("logoutServiceRedirectBindingURL")}
            forID="logoutServiceRedirectBindingURL"
          />
        }
      >
        <TextInput
          ref={register()}
          type="text"
          id="logoutServiceRedirectBindingURL"
          name="attributes.saml.single.logout.service.url.redirect"
        />
      </FormGroup>

      <ActionGroup>
        <Button variant="tertiary" onClick={save}>
          {t("common:save")}
        </Button>
        <Button variant="link" onClick={reset}>
          {t("common:revert")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
