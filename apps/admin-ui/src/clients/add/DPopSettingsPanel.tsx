import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";
import { FormGroup, Switch } from "@patternfly/react-core";

import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import type { ClientSettingsProps } from "../ClientSettings";
import { FormAccess } from "../../components/form-access/FormAccess";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { useAccess } from "../../context/access/Access";
import { SaveReset } from "../advanced/SaveReset";
import { convertAttributeNameToForm } from "../../util";

export const DPopPanel = ({
  save,
  reset,
  client: { access },
}: ClientSettingsProps) => {
  const { t } = useTranslation("clients");
  const { control } = useFormContext<ClientRepresentation>();

  const { hasAccess } = useAccess();
  const isManager = hasAccess("manage-clients") || access?.configure;

  return (
    <FormAccess
      isHorizontal
      fineGrainedAccess={access?.configure}
      role="manage-clients"
    >
      <FormGroup
        label={t("dPopSettings")}
        fieldId="kc-dPopEnabled"
        hasNoPaddingTop
        labelIcon={
          <HelpItem helpText="clients-help:dPop" fieldLabelId="clients:dPop" />
        }
      >
        <Controller
          name={convertAttributeNameToForm("attributes.dPop.enabled")}
          defaultValue={false}
          control={control}
          render={({ onChange, value }) => (
            <Switch
              id="kc-dPop-switch"
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={value === "true"}
              onChange={(value) => onChange(value.toString())}
              aria-label={t("dPop")}
            />
          )}
        />
      </FormGroup>
      <SaveReset
        className="keycloak__form_actions"
        name="settings"
        save={save}
        reset={reset}
        isActive={isManager}
      />
    </FormAccess>
  );
};
