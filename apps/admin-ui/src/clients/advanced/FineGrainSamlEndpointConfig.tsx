import { useTranslation } from "react-i18next";
import type { Control } from "react-hook-form";
import { ActionGroup, Button, FormGroup } from "@patternfly/react-core";

import { FormAccess } from "../../components/form-access/FormAccess";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { KeycloakTextInput } from "../../components/keycloak-text-input/KeycloakTextInput";
import { ApplicationUrls } from "./ApplicationUrls";

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
      <ApplicationUrls />
      <FormGroup
        label={t("assertionConsumerServicePostBindingURL")}
        fieldId="assertionConsumerServicePostBindingURL"
        labelIcon={
          <HelpItem
            helpText="clients-help:assertionConsumerServicePostBindingURL"
            fieldLabelId="clients:assertionConsumerServicePostBindingURL"
          />
        }
      >
        <KeycloakTextInput
          type="text"
          id="assertionConsumerServicePostBindingURL"
          {...register("attributes.saml_assertion_consumer_url_post")}
        />
      </FormGroup>
      <FormGroup
        label={t("assertionConsumerServiceRedirectBindingURL")}
        fieldId="assertionConsumerServiceRedirectBindingURL"
        labelIcon={
          <HelpItem
            helpText="clients-help:assertionConsumerServiceRedirectBindingURL"
            fieldLabelId="clients:assertionConsumerServiceRedirectBindingURL"
          />
        }
      >
        <KeycloakTextInput
          type="text"
          id="assertionConsumerServiceRedirectBindingURL"
          {...register("attributes.saml_assertion_consumer_url_redirect")}
        />
      </FormGroup>
      <FormGroup
        label={t("logoutServicePostBindingURL")}
        fieldId="logoutServicePostBindingURL"
        labelIcon={
          <HelpItem
            helpText="clients-help:logoutServicePostBindingURL"
            fieldLabelId="clients:logoutServicePostBindingURL"
          />
        }
      >
        <KeycloakTextInput
          type="text"
          id="logoutServicePostBindingURL"
          {...register("attributes.saml_single_logout_service_url_post")}
        />
      </FormGroup>
      <FormGroup
        label={t("logoutServiceRedirectBindingURL")}
        fieldId="logoutServiceRedirectBindingURL"
        labelIcon={
          <HelpItem
            helpText="clients-help:logoutServiceRedirectBindingURL"
            fieldLabelId="clients:logoutServiceRedirectBindingURL"
          />
        }
      >
        <KeycloakTextInput
          type="text"
          id="logoutServiceRedirectBindingURL"
          {...register("attributes.saml_single_logout_service_url_redirect")}
        />
      </FormGroup>
      <FormGroup
        label={t("logoutServiceArtifactBindingUrl")}
        fieldId="logoutServiceArtifactBindingUrl"
        labelIcon={
          <HelpItem
            helpText="clients-help:logoutServiceArtifactBindingUrl"
            fieldLabelId="clients:logoutServiceArtifactBindingUrl"
          />
        }
      >
        <KeycloakTextInput
          type="text"
          id="logoutServiceArtifactBindingUrl"
          {...register("attributes.saml_single_logout_service_url_artifact")}
        />
      </FormGroup>
      <FormGroup
        label={t("artifactBindingUrl")}
        fieldId="artifactBindingUrl"
        labelIcon={
          <HelpItem
            helpText="clients-help:artifactBindingUrl"
            fieldLabelId="clients:artifactBindingUrl"
          />
        }
      >
        <KeycloakTextInput
          type="text"
          id="artifactBindingUrl"
          {...register("attributes.saml_artifact_binding_url")}
        />
      </FormGroup>
      <FormGroup
        label={t("artifactResolutionService")}
        fieldId="artifactResolutionService"
        labelIcon={
          <HelpItem
            helpText="clients-help:artifactResolutionService"
            fieldLabelId="clients:artifactResolutionService"
          />
        }
      >
        <KeycloakTextInput
          type="text"
          id="artifactResolutionService"
          {...register("attributes.saml_artifact_resolution_service_url")}
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
