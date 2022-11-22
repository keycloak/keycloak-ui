import { FormGroup } from "@patternfly/react-core";
import { useFormContext } from "react-hook-form-v7";
import { useTranslation } from "react-i18next";

import ClientRepresentation from "libs/keycloak-admin-client/lib/defs/clientRepresentation";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { KeycloakTextInput } from "../../components/keycloak-text-input/KeycloakTextInput";
import { convertAttributeNameToForm } from "../../util";

export const ApplicationUrls = () => {
  const { t } = useTranslation("clients");
  const { register } = useFormContext();

  return (
    <>
      <FormGroup
        label={t("logoUrl")}
        fieldId="logoUrl"
        labelIcon={
          <HelpItem
            helpText="clients-help:logoUrl"
            fieldLabelId="clients:logoUrl"
          />
        }
      >
        <KeycloakTextInput
          id="logoUrl"
          data-testid="logoUrl"
          {...register(
            convertAttributeNameToForm<ClientRepresentation>(
              "attributes.logoUri"
            )
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("policyUrl")}
        fieldId="policyUrl"
        labelIcon={
          <HelpItem
            helpText="clients-help:policyUrl"
            fieldLabelId="clients:policyUrl"
          />
        }
      >
        <KeycloakTextInput
          id="policyUrl"
          data-testid="policyUrl"
          {...register(
            convertAttributeNameToForm<ClientRepresentation>(
              "attributes.policyUri"
            )
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("termsOfServiceUrl")}
        fieldId="termsOfServiceUrl"
        labelIcon={
          <HelpItem
            helpText="clients-help:termsOfServiceUrl"
            fieldLabelId="clients:termsOfServiceUrl"
          />
        }
      >
        <KeycloakTextInput
          id="termsOfServiceUrl"
          data-testid="termsOfServiceUrl"
          {...register(
            convertAttributeNameToForm<ClientRepresentation>(
              "attributes.tosUri"
            )
          )}
        />
      </FormGroup>
    </>
  );
};
