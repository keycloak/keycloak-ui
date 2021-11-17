import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { sortBy, sortedUniq } from "lodash";
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core";

import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import type { ComponentProps } from "./components";
import type { MultiLine } from "../multi-line-input/MultiLineInput";
import { useAdminClient, useFetch } from "../../context/auth/AdminClient";
import { HelpItem } from "../help-enabler/HelpItem";
import { convertToHyphens } from "../../util";

export const MultivaluedRoleComponent = ({
  name,
  label,
  helpText,
}: ComponentProps) => {
  const { t } = useTranslation("dynamic");
  const fieldName = `config.${convertToHyphens(name!)}`;

  const adminClient = useAdminClient();
  const { control } = useFormContext();

  const [clientRoles, setClientRoles] = useState<RoleRepresentation[]>([]);
  const [open, setOpen] = useState(false);

  const alphabetize = (rolesList: RoleRepresentation[]) => {
    return sortBy(rolesList, (role) => role.name?.toUpperCase());
  };

  useFetch(
    async () => {
      const clients = await adminClient.clients.find();
      const clientRoles = await Promise.all(
        clients.map(async (client) => {
          const roles = await adminClient.clients.listRoles({ id: client.id! });

          return roles.map<RoleRepresentation>((role) => ({
            ...role,
          }));
        })
      );

      return alphabetize(clientRoles.flat());
    },
    (clientRoles) => {
      setClientRoles(clientRoles);
    },
    []
  );

  const clientRoleNames = sortedUniq(clientRoles.map((item) => item.name));

  return (
    <FormGroup
      label={t(label!)}
      labelIcon={
        <HelpItem helpText={t(helpText!)} forLabel={label!} forID={name!} />
      }
      fieldId={name!}
    >
      <Controller
        name={fieldName}
        defaultValue={[]}
        control={control}
        rules={{ required: true }}
        render={({ onChange, value }) => (
          <Select
            onToggle={(isExpanded) => setOpen(isExpanded)}
            isOpen={open}
            data-testid="multivalued-role-select"
            variant={SelectVariant.typeaheadMulti}
            placeholderText={t("selectARole")}
            chipGroupProps={{
              numChips: 5,
              expandedText: t("common:hide"),
              collapsedText: t("common:showRemaining"),
            }}
            typeAheadAriaLabel={t("selectARole")}
            selections={value.map((v: MultiLine) => v.value)}
            isCreatable
            onSelect={(_, v) => {
              const option = v.toString();
              if (value.map((v: MultiLine) => v.value).includes(option)) {
                onChange(
                  value.filter((item: MultiLine) => item.value !== option)
                );
              } else {
                onChange([...value, { value: option }]);
              }
            }}
            maxHeight={200}
            onClear={() => onChange([])}
          >
            {clientRoleNames.map((option) => (
              <SelectOption key={option} value={option} />
            ))}
          </Select>
        )}
      />
    </FormGroup>
  );
};
