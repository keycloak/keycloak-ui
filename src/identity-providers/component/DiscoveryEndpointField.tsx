import React, { ReactNode, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormGroup, TextInput, Switch } from "@patternfly/react-core";

import { HelpItem } from "../../components/help-enabler/HelpItem";
import { useAdminClient } from "../../context/auth/AdminClient";

type DiscoveryEndpointFieldProps = {
  id: string;
  fileUpload: ReactNode;
  children: (readOnly: boolean) => ReactNode;
};

export const DiscoveryEndpointField = ({
  id,
  fileUpload,
  children,
}: DiscoveryEndpointFieldProps) => {
  const { t } = useTranslation("identity-providers");

  const adminClient = useAdminClient();

  const { setValue, register, errors, setError } = useFormContext();

  const [discovery, setDiscovery] = useState(true);
  const [discoveryUrl, setDiscoveryUrl] = useState("");
  const [discovering, setDiscovering] = useState(false);
  const [discoveryResult, setDiscoveryResult] = useState<any>();

  const setupForm = (result: any) => {
    Object.keys(result).map((k) => setValue(`config.${k}`, result[k]));
  };

  useEffect(() => {
    if (!discovering) {
      return;
    }

    setDiscovering(!!discoveryUrl);

    if (!discoveryUrl) {
      return;
    }

    (async () => {
      let result;
      try {
        result = await adminClient.identityProviders.importFromUrl({
          providerId: id,
          fromUrl: discoveryUrl,
        });
      } catch (error) {
        setDiscovering(false);
        setError("discoveryError", {
          type: "manual",
          message: (error as Error).message,
        });
      }

      setDiscoveryResult(result);
      setupForm(result);
      setDiscovering(false);
    })();
  }, [discovering]);

  return (
    <>
      <FormGroup
        label={t("useDiscoveryEndpoint")}
        fieldId="kc-discovery-endpoint-switch"
        labelIcon={
          <HelpItem
            helpText="identity-providers-help:useDiscoveryEndpoint"
            forLabel={t("useDiscoveryEndpoint")}
            forID="kc-discovery-endpoint-switch"
          />
        }
      >
        <Switch
          id="kc-discovery-endpoint-switch"
          label={t("common:on")}
          labelOff={t("common:off")}
          isChecked={discovery}
          onChange={setDiscovery}
        />
      </FormGroup>
      {discovery && (
        <FormGroup
          label={t("discoveryEndpoint")}
          fieldId="kc-discovery-endpoint"
          labelIcon={
            <HelpItem
              helpText="identity-providers-help:discoveryEndpoint"
              forLabel={t("discoveryEndpoint")}
              forID="kc-discovery-endpoint"
            />
          }
          validated={
            errors.discoveryError || errors.discoveryEndpoint
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
            placeholder={
              id === "oidc"
                ? "https://hostname/auth/realms/master/.well-known/openid-configuration"
                : "https://hostname/context/saml/discovery"
            }
            value={discoveryUrl}
            onChange={setDiscoveryUrl}
            onBlur={() => setDiscovering(!discovering)}
            validated={
              errors.discoveryError || errors.discoveryEndpoint
                ? "error"
                : !discoveryResult
                ? "default"
                : "success"
            }
            customIconUrl={
              discovering
                ? 'data:image/svg+xml;charset=utf8,%3Csvg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid"%3E%3Ccircle cx="50" cy="50" fill="none" stroke="%230066cc" stroke-width="10" r="35" stroke-dasharray="164.93361431346415 56.97787143782138"%3E%3CanimateTransform attributeName="transform" type="rotate" repeatCount="indefinite" dur="1s" values="0 50 50;360 50 50" keyTimes="0;1"%3E%3C/animateTransform%3E%3C/circle%3E%3C/svg%3E'
                : ""
            }
            ref={register({ required: true })}
          />
        </FormGroup>
      )}
      {!discovery && fileUpload}
      {discovery && !errors.discoveryError && children(true)}
      {!discovery && children(false)}
    </>
  );
};
