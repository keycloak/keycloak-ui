import React from "react";
import { useTranslation } from "react-i18next";
import { Control, Controller } from "react-hook-form";
import { ActionGroup, Button, FormGroup, Switch } from "@patternfly/react-core";

import { FormAccess } from "../../components/form-access/FormAccess";
import { HelpItem } from "../../components/help-enabler/HelpItem";

type OpenIdConnectCompatibilityModesProps = {
  control: Control<Record<string, any>>;
  save: () => void;
  reset: () => void;
};

export const OpenIdConnectCompatibilityModes = ({
  control,
  save,
  reset,
}: OpenIdConnectCompatibilityModesProps) => {
  const { t } = useTranslation("clients");
  return (
    <FormAccess role="manage-realm" isHorizontal>
      <FormGroup
        label={t("excludeSessionStateFromAuthenticationResponse")}
        fieldId="excludeSessionStateFromAuthenticationResponse"
        labelIcon={
          <HelpItem
            helpText="clients-help:excludeSessionStateFromAuthenticationResponsem"
            forLabel={t("excludeSessionStateFromAuthenticationResponse")}
            forID="excludeSessionStateFromAuthenticationResponse"
          />
        }
      >
        <Controller
          name="attributes.exclude_session_state_from_auth_response"
          defaultValue=""
          control={control}
          render={({ onChange, value }) => (
            <Switch
              id="excludeSessionStateFromAuthenticationResponse"
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={value === "true"}
              onChange={(value) => onChange("" + value)}
            />
          )}
        />
      </FormGroup>
      <ActionGroup>
        <Button variant="tertiary" onClick={save}>
          {t("common:save")}
        </Button>
        <Button variant="link" onClick={reset}>
          {t("common:reload")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
