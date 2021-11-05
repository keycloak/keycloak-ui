import React, { useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core";

import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { useAdminClient, useFetch } from "../../../context/auth/AdminClient";
import { HelpItem } from "../../../components/help-enabler/HelpItem";
import { convertToHyphens } from "../../../util";
import type { ComponentProps } from "../../../components/dynamic/components";
import { sortBy, sortedUniq } from "lodash";

export const MultivaluedRoleComponent = ({
  name,
  label,
  helpText,
  parentCallback,
}: ComponentProps) => {
  const { t } = useTranslation("client-scopes");

  const adminClient = useAdminClient();
  const { control } = useFormContext();

  const [clientRoles, setClientRoles] = useState<RoleRepresentation[]>([]);

  const [open, setOpen] = useState(false);

  const fieldName = `config.${convertToHyphens(name!)}`;

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
        defaultValue=""
        control={control}
        rules={{ required: true }}
        render={({ onChange, value }) => {
          return (
            <Select
              onToggle={(isExpanded) => setOpen(isExpanded)}
              isOpen={open}
              className="kc-role-select"
              data-testid="multivalued-role-select"
              variant={SelectVariant.typeaheadMulti}
              placeholderText={t("selectARole")}
              chipGroupProps={{
                numChips: 5,
                expandedText: t("common:hide"),
                collapsedText: t("common:showRemaining"),
              }}
              typeAheadAriaLabel={t("selectARole")}
              selections={value.length !== 0 ? value : []}
              isCreatable
              onSelect={(_, v) => {
                const role = v.toString();
                if (!value) {
                  parentCallback!([role]);
                  onChange([role]);
                } else if (value.includes(role)) {
                  const updatedVal = value.filter(
                    (item: string) => item !== role
                  );
                  parentCallback!(updatedVal);
                  onChange(updatedVal);
                } else {
                  parentCallback!([...value, role]);
                  onChange([...value, role]);
                }
              }}
              maxHeight={200}
              onClear={() => onChange([])}
            >
              {clientRoleNames.map((option) => (
                <SelectOption key={option} value={option} />
              ))}
            </Select>
          );
        }}
      />
    </FormGroup>
  );
};
