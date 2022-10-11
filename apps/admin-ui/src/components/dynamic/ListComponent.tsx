import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core";

import type { ComponentProps } from "./components";
import { HelpItem } from "../help-enabler/HelpItem";
import { convertToName } from "./DynamicComponents";

export const ListComponent = ({
  name,
  label,
  helpText,
  defaultValue,
  options,
  isDisabled = false,
}: ComponentProps) => {
  const { t } = useTranslation("dynamic");
  const { control } = useFormContext();
  const [open, setOpen] = useState(false);

  return (
    <FormGroup
      label={t(label!)}
      labelIcon={
        <HelpItem helpText={t(helpText!)} fieldLabelId={`dynamic:${label}`} />
      }
      fieldId={name!}
    >
      <Controller
        name={convertToName(name!)}
        data-testid={name}
        defaultValue={defaultValue || ""}
        control={control}
        render={({ field }) => (
          <Select
            toggleId={name}
            isDisabled={isDisabled}
            onToggle={(toggle) => setOpen(toggle)}
            onSelect={(_, value) => {
              field.onChange(value as string);
              setOpen(false);
            }}
            selections={field.value}
            variant={SelectVariant.single}
            aria-label={t(label!)}
            isOpen={open}
          >
            {options?.map((option) => (
              <SelectOption
                selected={option === field.value}
                key={option}
                value={option}
              />
            ))}
          </Select>
        )}
      />
    </FormGroup>
  );
};
