import React, { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { FormGroup, Switch, TextInput, Title } from "@patternfly/react-core";

import { HelpItem } from "../../components/help-enabler/HelpItem";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../../context/auth/AdminClient";
import type { SamlConfigurationRepresentation } from "../SamlConfigurationRepresentation";
// import { JsonFileUpload } from "../../components/json-file-upload/JsonFileUpload";
import { useRealm } from "../../context/realm-context/RealmContext";
import { DiscoverySettings } from "./DiscoverySettings";
import { getBaseUrl } from "../../util";

type Result = SamlConfigurationRepresentation & {
  error: string;
};

export const SamlConnectSettings = () => {
  const { t } = useTranslation("identity-providers");
  const id = "oidc";

  const adminClient = useAdminClient();
  const { realm } = useRealm();
  const { setValue, register, errors } = useFormContext();

  const [discovery, setDiscovery] = useState(true);
  const [serviceProviderEntityUrl, setServiceProviderEntityUrl] = useState("");
  const [discovering, setDiscovering] = useState(false);
  const [discoveryResult, setDiscoveryResult] = useState<Result>();

  const defaultEntityUrl = `${getBaseUrl(adminClient)}realms/${realm}`;

  const setupForm = (result: any) => {
    Object.keys(result).map((k) => setValue(`config.${k}`, result[k]));
  };

  useEffect(() => {
    if (discovering) {
      setDiscovering(!!serviceProviderEntityUrl);
      if (serviceProviderEntityUrl)
        (async () => {
          let result;
          try {
            result = await adminClient.identityProviders.importFromUrl({
              providerId: id,
              fromUrl: serviceProviderEntityUrl,
            });
          } catch (error) {
            result = { error };
          }

          setDiscoveryResult(result as Result);
          setupForm(result);
          setDiscovering(false);
        })();
    }
  }, [discovering]);

  // const fileUpload = async (obj: object) => {
  //   if (obj) {
  //     const formData = new FormData();
  //     formData.append("providerId", id);
  //     formData.append("file", new Blob([JSON.stringify(obj)]));

  //     try {
  //       const response = await fetch(
  //         `${getBaseUrl(
  //           adminClient
  //         )}admin/realms/${realm}/identity-provider/import-config`,
  //         {
  //           method: "POST",
  //           body: formData,
  //           headers: {
  //             Authorization: `bearer ${await adminClient.getAccessToken()}`,
  //           },
  //         }
  //       );
  //       const result = await response.json();
  //       setupForm(result);
  //     } catch (error) {
  //       setDiscoveryResult({ error });
  //     }
  //   }
  // };

  return (
    <>
      <Title headingLevel="h4" size="xl" className="kc-form-panel__title">
        {t("samlSettings")}
      </Title>

      {
        // Change 'Use discovery endpoint' to 'Use entity descriptor'
      }

      <FormGroup
        label={t("serviceProviderEntityId")}
        fieldId="kc-service-provider-entity-id"
        labelIcon={
          <HelpItem
            helpText="identity-providers-help:serviceProviderEntityId"
            forLabel={t("serviceProviderEntityId")}
            forID="kc-service-provider-entity-id"
          />
        }
        isRequired
      >
        <TextInput
          type="text"
          name="serviceProviderEntityId"
          data-testid="serviceProviderEntityId"
          id="kc-service-provider-entity-id"
          value={serviceProviderEntityUrl || defaultEntityUrl}
          onChange={setServiceProviderEntityUrl}
          ref={register({ required: true })}
        />
      </FormGroup>

      <FormGroup
        label={t("useEntityDescriptor")}
        fieldId="kc-discovery-endpoint-switch"
        labelIcon={
          <HelpItem
            helpText="identity-providers-help:useDiscoveryEndpoint"
            forLabel={t("useDiscoveryEndpoint")}
            forID="kc-use-entity-descriptor-switch"
          />
        }
      >
        <Switch
          id="kc-use-entity-descriptor-switch"
          label={t("common:on")}
          labelOff={t("common:off")}
          isChecked={discovery}
          onChange={setDiscovery}
        />
      </FormGroup>

      {discovery && (
        <FormGroup
          label={t("samlEntityDescriptor")}
          fieldId="kc-saml-entity-descriptor"
          labelIcon={
            <HelpItem
              helpText="identity-providers-help:samlEntityDescriptor"
              forLabel={t("samlEntityDescriptor")}
              forID="kc-saml-entity-descriptor"
            />
          }
          validated={
            (discoveryResult && discoveryResult.error) ||
            errors.discoveryEndpoint
              ? "error"
              : !discoveryResult
              ? "default"
              : "success"
          }
          helperTextInvalid={
            errors.discoveryEndpoint
              ? t("common:required")
              : t("noValidMetaDataFound")
          }
          isRequired
        >
          <TextInput
            type="text"
            name="discoveryEndpoint"
            data-testid="discoveryEndpoint"
            id="kc-discovery-endpoint"
            value={serviceProviderEntityUrl}
            onChange={setServiceProviderEntityUrl}
            onBlur={() => setDiscovering(!discovering)}
            validated={
              (discoveryResult && discoveryResult.error) ||
              errors.discoveryEndpoint
                ? "error"
                : !discoveryResult
                ? "default"
                : "success"
            }
            ref={register({ required: true })}
          />
        </FormGroup>
      )}
      {discovery && discoveryResult && !discoveryResult.error && (
        <DiscoverySettings readOnly={true} />
      )}
      {!discovery && <DiscoverySettings readOnly={false} />}
    </>
  );
};
