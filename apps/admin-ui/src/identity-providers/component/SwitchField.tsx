import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";
import { Switch } from "@patternfly/react-core";

import { FieldProps, FormGroupField } from "./FormGroupField";

type FieldType = "boolean" | "string";

type SwitchFieldProps = FieldProps & {
  fieldType?: FieldType;
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
        render={({ field }) => (
          <Switch
            id={label}
            label={t("common:on")}
            labelOff={t("common:off")}
            isChecked={
              fieldType === "string" ? field.value === "true" : field.value
            }
            onChange={(value) =>
              field.onChange(fieldType === "string" ? "" + value : value)
            }
            isDisabled={isReadOnly}
            aria-label={label}
          />
        )}
      />
    </FormGroupField>
  );
};
