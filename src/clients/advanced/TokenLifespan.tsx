import React, { useState } from "react";
import { Control, Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Split,
  SplitItem,
} from "@patternfly/react-core";

import {
  TimeSelector,
  Unit,
} from "../../components/time-selector/TimeSelector";
import { HelpItem } from "../../components/help-enabler/HelpItem";

type TokenLifespanProps = {
  id: string;
  name: string;
  defaultValue: string;
  control: Control<Record<string, any>>;
  units?: Unit[];
};

const never = "tokenLifespan.never";
const expires = "tokenLifespan.expires";

export const TokenLifespan = ({
  id,
  name,
  defaultValue,
  control,
  units,
}: TokenLifespanProps) => {
  const { t } = useTranslation("clients");
  const [open, setOpen] = useState(false);

  return (
    <FormGroup
      label={t(id)}
      fieldId={id}
      labelIcon={
        <HelpItem
          helpText={`clients-help:${id}`}
          forLabel={t(id)}
          forID={t(`common:helpLabel`, {
            label: t(id),
          })}
        />
      }
    >
      <Controller
        name={name}
        defaultValue={defaultValue}
        control={control}
        render={({ onChange, value }) => (
          <Split hasGutter>
            <SplitItem>
              <Select
                toggleId={`toggle-${id}`}
                variant={SelectVariant.single}
                onToggle={(isExpanded) => setOpen(isExpanded)}
                isOpen={open}
                onSelect={(_, value) => {
                  onChange(value);
                  setOpen(false);
                }}
                selections={[
                  value === "" || value === -1 ? t(never) : t(expires),
                ]}
              >
                <SelectOption key={never} value={-1}>
                  {t(never)}
                </SelectOption>
                <SelectOption key={expires} value={60}>
                  {t(expires)}
                </SelectOption>
              </Select>
            </SplitItem>
            <SplitItem>
              {value !== "" && value !== -1 && (
                <TimeSelector units={units} value={value} onChange={onChange} />
              )}
            </SplitItem>
          </Split>
        )}
      />
    </FormGroup>
  );
};
