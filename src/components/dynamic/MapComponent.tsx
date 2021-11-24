import React from "react";
import { useTranslation } from "react-i18next";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FormGroup } from "@patternfly/react-core";

import { HelpItem } from "../help-enabler/HelpItem";
import type { ComponentProps } from "./components";
import { convertToHyphens } from "../../util";
import { AttributesForm } from "../attribute-form/AttributeForm";

export const MapComponent = ({ name, label, helpText }: ComponentProps) => {
  const { t } = useTranslation("dynamic");
  const form = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: `config.${convertToHyphens(name!)}`,
  });

  return (
    <FormGroup
      label={t(label!)}
      labelIcon={
        <HelpItem helpText={t(helpText!)} forLabel={label!} forID={name!} />
      }
      fieldId={name!}
    >
      <AttributesForm inConfig form={form} array={{ fields, append, remove }} />
    </FormGroup>
  );
};
