import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";
import { Select, SelectOption, SelectVariant } from "@patternfly/react-core";

import { useAdminClient, useFetch } from "../../context/auth/AdminClient";

type ScopeSelectProps = {
  clientId: string;
  resourceId?: string;
};

export const ScopeSelect = ({ clientId, resourceId }: ScopeSelectProps) => {
  const { t } = useTranslation("clients");
  const adminClient = useAdminClient();

  const { control, errors, setValue } = useFormContext();

  const [items, setItems] = useState<JSX.Element[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const firstUpdate = useRef(true);

  useFetch(
    async () => {
      if (resourceId) {
        if (!firstUpdate.current) {
          setValue("scopes", []);
        }
        firstUpdate.current = false;
        return adminClient.clients.listScopesByResource({
          id: clientId,
          resourceName: resourceId,
        });
      }

      return adminClient.clients.listAllScopes(
        Object.assign(
          { id: clientId, first: 0, max: 10, deep: false },
          search === "" ? null : { name: search }
        )
      );
    },
    (scopes) =>
      setItems(
        scopes.map((scope) => (
          <SelectOption key={scope.id} value={scope.id}>
            {scope.name}
          </SelectOption>
        ))
      ),
    [resourceId, search]
  );

  return (
    <Controller
      name="scopes"
      defaultValue={[]}
      control={control}
      rules={{ validate: (value) => value.length > 0 }}
      render={({ onChange, value }) => (
        <Select
          toggleId="scopes"
          variant={SelectVariant.typeaheadMulti}
          onToggle={setOpen}
          onFilter={(_, filter) => {
            setSearch(filter);
            return items;
          }}
          onClear={() => {
            onChange([]);
            setSearch("");
          }}
          selections={value}
          onSelect={(_, selectedValue) => {
            const option = selectedValue.toString();
            const changedValue = value.find((p: string) => p === option)
              ? value.filter((p: string) => p !== option)
              : [...value, option];
            onChange(changedValue);
            setSearch("");
          }}
          isOpen={open}
          aria-labelledby={t("scopes")}
          validated={errors.scopes ? "error" : "default"}
        >
          {items}
        </Select>
      )}
    />
  );
};
