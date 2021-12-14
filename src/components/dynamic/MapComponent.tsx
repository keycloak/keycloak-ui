import React from "react";
import { useTranslation } from "react-i18next";
import { FormGroup } from "@patternfly/react-core";

import type { ComponentProps } from "./components";
import { HelpItem } from "../help-enabler/HelpItem";
import { AttributeInput } from "../attribute-input/AttributeInput";

export const MapComponent = ({ name, label, helpText }: ComponentProps) => {
  const { t } = useTranslation("dynamic");

  return (
    <FormGroup
      label={t(label!)}
      labelIcon={
        <HelpItem helpText={t(helpText!)} forLabel={label!} forID={name!} />
      }
      fieldId={name!}
    >
      <AttributeInput name={`config.${name}`} />
    </FormGroup>
  );
};
