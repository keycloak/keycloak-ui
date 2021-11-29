import React from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";
import { Switch } from "@patternfly/react-core";

import { FieldProps, FormGroupField } from "./FormGroupField";

type FieldType = "boolean" | "string";

type SwitchFieldProps = FieldProps & {
  fieldType?: FieldType;
  id?: string;
};

export const SwitchField = ({
  label,
  field,
  fieldType = "string",
  isReadOnly = false,
}: SwitchFieldProps) => {
  const { t } = useTranslation("identity-providers");
  const { control } = useFormContext();
  return (
    <FormGroupField label={label}>
      <Controller
        name={field}
        defaultValue={fieldType === "string" ? "false" : false}
        control={control}
        render={({ onChange, value }) => (
          <Switch
            id={label}
            className={`kc-${label}`}
            label={t("common:on")}
            labelOff={t("common:off")}
            isChecked={
              fieldType === "string" ? value === "true" : (value as boolean)
            }
            onChange={(value) =>
              onChange(fieldType === "string" ? "" + value : value)
            }
            isDisabled={isReadOnly}
          />
        )}
      />
    </FormGroupField>
  );
};
