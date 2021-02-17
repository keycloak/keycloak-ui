import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Control, Controller } from "react-hook-form";
import {
  ActionGroup,
  Button,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
} from "@patternfly/react-core";

import { FormAccess } from "../../components/form-access/FormAccess";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { TimeSelector } from "../../components/time-selector/TimeSelector";

type AdvancedSettingsProps = {
  control: Control<Record<string, any>>;
  save: () => void;
  reset: () => void;
  protocol?: string;
};

export const AdvancedSettings = ({
  control,
  save,
  reset,
  protocol,
}: AdvancedSettingsProps) => {
  const { t } = useTranslation("clients");
  const [open, setOpen] = useState(false);
  return (
    <FormAccess role="manage-realm" isHorizontal>
      {protocol !== "openid-connect" && (
        <FormGroup
          label={t("assertionLifespan")}
          fieldId="assertionLifespan"
          labelIcon={
            <HelpItem
              helpText="clients-help:assertionLifespan"
              forLabel={t("assertionLifespan")}
              forID="assertionLifespan"
            />
          }
        >
          <Controller
            name="attributes.saml-assertion-lifespan"
            defaultValue=""
            control={control}
            render={({ onChange, value }) => (
              <TimeSelector
                units={["minutes", "days", "hours"]}
                value={value}
                onChange={onChange}
              />
            )}
          />
        </FormGroup>
      )}
      {protocol === "openid-connect" && (
        <>
          <FormGroup
            label={t("accessTokenLifespan")}
            fieldId="accessTokenLifespan"
            labelIcon={
              <HelpItem
                helpText="clients-help:accessTokenLifespan"
                forLabel={t("accessTokenLifespan")}
                forID="accessTokenLifespan"
              />
            }
          >
            <Controller
              name="attributes.access-token-lifespan"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <TimeSelector
                  units={["minutes", "days", "hours"]}
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </FormGroup>

          <FormGroup
            label={t("oAuthMutual")}
            fieldId="oAuthMutual"
            hasNoPaddingTop
            labelIcon={
              <HelpItem
                helpText="clients-help:oAuthMutual"
                forLabel={t("oAuthMutual")}
                forID="oAuthMutual"
              />
            }
          >
            <Controller
              name="attributes.tls-client-certificate-bound-access-tokens"
              defaultValue={false}
              control={control}
              render={({ onChange, value }) => (
                <Switch
                  id="oAuthMutual"
                  label={t("common:on")}
                  labelOff={t("common:off")}
                  isChecked={value === "true"}
                  onChange={(value) => onChange("" + value)}
                />
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("keyForCodeExchange")}
            fieldId="keyForCodeExchange"
            hasNoPaddingTop
            labelIcon={
              <HelpItem
                helpText="clients-help:keyForCodeExchange"
                forLabel={t("keyForCodeExchange")}
                forID="keyForCodeExchange"
              />
            }
          >
            <Controller
              name="attributes.pkce-code-challenge-method"
              defaultValue={false}
              control={control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="keyForCodeExchange"
                  variant={SelectVariant.single}
                  onToggle={() => setOpen(!open)}
                  isOpen={open}
                  onSelect={(_, value) => {
                    onChange(value);
                    setOpen(false);
                  }}
                  selections={[value]}
                >
                  {["", "S256", "plain"].map((v) => (
                    <SelectOption key={v} value={v} />
                  ))}
                </Select>
              )}
            />
          </FormGroup>
        </>
      )}
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
