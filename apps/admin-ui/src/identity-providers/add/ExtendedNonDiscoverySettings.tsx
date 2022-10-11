import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";
import {
  ExpandableSection,
  Form,
  FormGroup,
  NumberInput,
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core";

import { SwitchField } from "../component/SwitchField";
import { TextField } from "../component/TextField";
import { FormGroupField } from "../component/FormGroupField";
import { HelpItem } from "../../components/help-enabler/HelpItem";

const promptOptions = {
  unspecified: "",
  none: "none",
  consent: "consent",
  login: "login",
  select_account: "select_account",
};

export const ExtendedNonDiscoverySettings = () => {
  const { t } = useTranslation("identity-providers");
  const { control } = useFormContext();

  const [isExpanded, setIsExpanded] = useState(false);
  const [promptOpen, setPromptOpen] = useState(false);

  return (
    <ExpandableSection
      toggleText={t("advanced")}
      onToggle={() => setIsExpanded(!isExpanded)}
      isExpanded={isExpanded}
    >
      <Form isHorizontal>
        <SwitchField label="passLoginHint" field="config.loginHint" />
        <SwitchField label="passMaxAge" field="config.passMaxAge" />
        <SwitchField label="passCurrentLocale" field="config.uiLocales" />
        <SwitchField
          field="config.backchannelSupported"
          label="backchannelLogout"
        />
        <SwitchField field="config.disableUserInfo" label="disableUserInfo" />
        <TextField field="config.defaultScope" label="scopes" />
        <FormGroupField label="prompt">
          <Controller
            name="config.prompt"
            defaultValue=""
            control={control}
            render={({ field }) => (
              <Select
                toggleId="prompt"
                required
                onToggle={() => setPromptOpen(!promptOpen)}
                onSelect={(_, value) => {
                  field.onChange(value as string);
                  setPromptOpen(false);
                }}
                selections={field.value || t(`prompts.unspecified`)}
                variant={SelectVariant.single}
                aria-label={t("prompt")}
                isOpen={promptOpen}
              >
                {Object.entries(promptOptions).map(([key, val]) => (
                  <SelectOption
                    selected={val === field.value}
                    key={key}
                    value={val}
                  >
                    {t(`prompts.${key}`)}
                  </SelectOption>
                ))}
              </Select>
            )}
          />
        </FormGroupField>
        <SwitchField
          field="config.acceptsPromptNoneForwardFromClient"
          label="acceptsPromptNone"
        />
        <FormGroup
          label={t("allowedClockSkew")}
          labelIcon={
            <HelpItem
              helpText={"identity-providers-help:allowedClockSkew"}
              fieldLabelId="identity-providers:allowedClockSkew"
            />
          }
          fieldId="allowedClockSkew"
        >
          <Controller
            name="config.allowedClockSkew"
            control={control}
            defaultValue={0}
            render={({ field }) => (
              <NumberInput
                value={field.value}
                data-testid="allowedClockSkew"
                onMinus={() => field.onChange(field.value - 1)}
                onChange={field.onChange}
                onPlus={() => field.onChange(field.value + 1)}
                inputName="input"
                inputAriaLabel={t("allowedClockSkew")}
                minusBtnAriaLabel={t("common:minus")}
                plusBtnAriaLabel={t("common:plus")}
                min={0}
                unit={t("common:times.seconds")}
              />
            )}
          />
        </FormGroup>
        <TextField field="config.forwardParameters" label="forwardParameters" />
      </Form>
    </ExpandableSection>
  );
};
