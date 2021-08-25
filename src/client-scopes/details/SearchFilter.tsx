import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Select,
  SelectOption,
  ToolbarItem,
} from "@patternfly/react-core";
import { FilterIcon } from "@patternfly/react-icons";

import {
  AllClientScopes,
  clientScopeTypesSelectOptions,
} from "../../components/client-scope/ClientScopeTypes";
import type { Row } from "../../clients/scopes/ClientScopes";

export type SearchType = "name" | "type" | "protocol";
export enum ProtocolType {
  all = "all",
  SAML = "SAML",
  openid = "openid-connect",
}
export const nameFilter =
  (search: string = "") =>
  (scope: Row) =>
    scope.name?.includes(search);
export const typeFilter = (type: AllClientScopes) => (scope: Row) =>
  type === AllClientScopes.none || scope.type === type;

type SearchToolbarProps = SearchDropdownProps & {
  searchType: SearchType;
  onType: (value: AllClientScopes) => void;
  onProtocol?: (value: ProtocolType) => void;
};

type SearchDropdownProps = {
  onSelect: (value: SearchType) => void;
  withProtocol?: boolean;
};

export const SearchDropdown = ({
  withProtocol = false,
  onSelect,
}: SearchDropdownProps) => {
  const { t } = useTranslation("clients");
  const [searchToggle, setSearchToggle] = useState(false);
  const [searchType, setSearchType] = useState<SearchType>("name");

  const options = [
    <DropdownItem
      key="all"
      onClick={() => {
        setSearchType("name");
        onSelect("name");
        setSearchToggle(false);
      }}
    >
      {t("clientScopeSearch.name")}
    </DropdownItem>,
    <DropdownItem
      key="client"
      onClick={() => {
        setSearchType("type");
        onSelect("type");
        setSearchToggle(false);
      }}
    >
      {t("clientScopeSearch.type")}
    </DropdownItem>,
  ];
  if (withProtocol) {
    options.push(
      <DropdownItem
        key="protocol"
        onClick={() => {
          setSearchType("protocol");
          onSelect("protocol");
          setSearchToggle(false);
        }}
      >
        {t("clientScopeSearch.protocol")}
      </DropdownItem>
    );
  }

  return (
    <Dropdown
      className="keycloak__client-scopes__searchtype"
      toggle={
        <DropdownToggle
          id="toggle-id"
          onToggle={(open) => setSearchToggle(open)}
        >
          <FilterIcon /> {t(`clientScopeSearch.${searchType}`)}
        </DropdownToggle>
      }
      aria-label="Select Input"
      isOpen={searchToggle}
      dropdownItems={options}
    />
  );
};

export const SearchToolbar = ({
  searchType,
  onSelect,
  onType,
  withProtocol = false,
  onProtocol,
}: SearchToolbarProps) => {
  const { t } = useTranslation("client-scope");
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<AllClientScopes | ProtocolType>(
    AllClientScopes.none
  );

  console.log("why", value);
  return (
    <>
      {searchType === "type" && (
        <>
          <ToolbarItem>
            <SearchDropdown onSelect={onSelect} />
          </ToolbarItem>
          <ToolbarItem>
            <Select
              className="keycloak__client-scopes__searchtype"
              onToggle={(open) => setOpen(open)}
              isOpen={open}
              selections={[
                value === AllClientScopes.none
                  ? t("common:allTypes")
                  : t(`common:clientScope.${value}`),
              ]}
              onSelect={(_, value) => {
                console.log(value);
                setValue(value as AllClientScopes);
                onType(value as AllClientScopes);
                setOpen(false);
              }}
            >
              <SelectOption value={AllClientScopes.none}>
                {t("common:allTypes")}
              </SelectOption>
              <>{clientScopeTypesSelectOptions(t)}</>
            </Select>
          </ToolbarItem>
        </>
      )}
      {searchType === "protocol" && withProtocol && (
        <>
          <ToolbarItem>
            <SearchDropdown onSelect={onSelect} />
          </ToolbarItem>
          <ToolbarItem>
            <Select
              className="keycloak__client-scopes__searchtype"
              onToggle={(open) => setOpen(open)}
              isOpen={open}
              selections={[value]}
              onSelect={(_, value) => {
                setValue(value as ProtocolType);
                onProtocol?.(value as ProtocolType);
                setOpen(false);
              }}
            >
              {Object.keys(ProtocolType).map((type) => (
                <SelectOption key={type} value={type} />
              ))}
            </Select>
          </ToolbarItem>
        </>
      )}
    </>
  );
};
