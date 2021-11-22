import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  ButtonVariant,
  Dropdown,
  DropdownToggle,
  Modal,
  ModalVariant,
  DropdownDirection,
  DropdownItem,
  Select,
  SelectOption,
  SelectVariant,
  SelectDirection,
} from "@patternfly/react-core";
import {
  CaretDownIcon,
  CaretUpIcon,
  FilterIcon,
} from "@patternfly/react-icons";
import type ClientScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientScopeRepresentation";

import {
  ClientScopeType,
  clientScopeTypesDropdown,
} from "../../components/client-scope/ClientScopeTypes";
import { KeycloakDataTable } from "../../components/table-toolbar/KeycloakDataTable";

import "./client-scopes.css";

export type AddScopeDialogProps = {
  clientScopes: ClientScopeRepresentation[];
  open: boolean;
  toggleDialog: () => void;
  onAdd: (
    scopes: { scope: ClientScopeRepresentation; type?: ClientScopeType }[]
  ) => void;
  isClientScopesConditionType?: boolean;
};

enum FilterType {
  Name = "name",
  Protocol = "protocol",
}

enum ProtocolType {
  All = "all",
  SAML = "saml",
  OpenIDConnect = "openid-connect",
}

export const AddScopeDialog = ({
  clientScopes,
  open,
  toggleDialog,
  onAdd,
  isClientScopesConditionType,
}: AddScopeDialogProps) => {
  const { t } = useTranslation("clients");
  const [addToggle, setAddToggle] = useState(false);
  const [rows, setRows] = useState<ClientScopeRepresentation[]>([]);
  const [filterType, setFilterType] = useState<FilterType>("Name");
  const [protocolType, setProtocolType] = useState<ProtocolType>("All");
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const [isFilterTypeDropdownOpen, setIsFilterTypeDropdownOpen] =
    useState(false);

  const [isProtocolTypeDropdownOpen, setIsProtocolTypeDropdownOpen] =
    useState(false);

  useEffect(() => {
    refresh();
  }, [filterType, protocolType]);

  const loader = () => {
    if (protocolType === "OpenID Connect") {
      return Promise.resolve(
        clientScopes.filter((item) => item.protocol === "openid-connect")
      );
    } else if (protocolType === "SAML") {
      return Promise.resolve(
        clientScopes.filter((item) => item.protocol === "saml")
      );
    } else return Promise.resolve(clientScopes);
  };

  const action = (scope: ClientScopeType) => {
    const scopes = rows.map((row) => {
      return { scope: row, type: scope };
    });
    onAdd(scopes);
    setAddToggle(false);
    toggleDialog();
  };

  const onFilterTypeDropdownToggle = () => {
    setIsFilterTypeDropdownOpen(!isFilterTypeDropdownOpen);
  };

  const onProtocolTypeDropdownToggle = () => {
    setIsProtocolTypeDropdownOpen(!isProtocolTypeDropdownOpen);
  };

  const onFilterTypeDropdownSelect = (filterType: string) => {
    if (filterType === "Name") {
      setFilterType("Protocol");
    }
    if (filterType === "Protocol") {
      setFilterType("Name");
    }
    setIsFilterTypeDropdownOpen(!isFilterTypeDropdownOpen);
  };

  const onProtocolTypeDropdownSelect = (protocolType: string) => {
    if (protocolType === "SAML") {
      setProtocolType("SAML");
    }
    if (protocolType === "OpenID Connect") {
      setProtocolType("OpenID Connect");
    }
    if (protocolType === "All") {
      setProtocolType("All");
    }
    setIsProtocolTypeDropdownOpen(!isProtocolTypeDropdownOpen);
  };

  const protocolTypeOptions = [
    <SelectOption key={1} value={ProtocolType.SAML}>
      {t("protocolTypes.saml")}
    </SelectOption>,
    <SelectOption key={2} value={ProtocolType.OpenIDConnect}>
      {t("protocolTypes.openIdConnect")}
    </SelectOption>,
    <SelectOption key={3} value={ProtocolType.All} isPlaceholder>
      {t("protocolTypes.all")}
    </SelectOption>,
  ];

  return (
    <Modal
      variant={ModalVariant.medium}
      title={
        isClientScopesConditionType
          ? t("addClientScope")
          : t("addClientScopesTo", { clientId: "test" })
      }
      isOpen={open}
      onClose={toggleDialog}
      actions={
        isClientScopesConditionType
          ? [
              <Button
                id="modal-add"
                data-testid="modalConfirm"
                key="add"
                variant={ButtonVariant.primary}
                onClick={() => {
                  const scopes = rows.map((scope) => ({ scope }));
                  onAdd(scopes);
                  toggleDialog();
                }}
              >
                {t("common:add")}
              </Button>,
              <Button
                id="modal-cancel"
                key="cancel"
                variant={ButtonVariant.link}
                onClick={() => {
                  setRows([]);
                  toggleDialog();
                }}
              >
                {t("common:cancel")}
              </Button>,
            ]
          : [
              <Dropdown
                className="keycloak__client-scopes-add__add-dropdown"
                id="add-dropdown"
                key="add-dropdown"
                direction={DropdownDirection.up}
                isOpen={addToggle}
                toggle={
                  <DropdownToggle
                    isDisabled={rows.length === 0}
                    onToggle={() => setAddToggle(!addToggle)}
                    isPrimary
                    toggleIndicator={CaretUpIcon}
                    id="add-scope-toggle"
                  >
                    {t("common:add")}
                  </DropdownToggle>
                }
                dropdownItems={clientScopeTypesDropdown(t, action)}
              />,
              <Button
                id="modal-cancel"
                key="cancel"
                variant={ButtonVariant.link}
                onClick={() => {
                  setRows([]);
                  toggleDialog();
                }}
              >
                {t("common:cancel")}
              </Button>,
            ]
      }
    >
      <KeycloakDataTable
        loader={loader}
        ariaLabelKey="client-scopes:chooseAMapperType"
        searchPlaceholderKey={
          filterType === "Name" ? "client-scopes:searchFor" : undefined
        }
        searchTypeComponent={
          <Dropdown
            onSelect={() => {
              onFilterTypeDropdownSelect(filterType);
            }}
            data-testid="filter-type-dropdown"
            toggle={
              <DropdownToggle
                id="toggle-id-9"
                onToggle={onFilterTypeDropdownToggle}
                toggleIndicator={CaretDownIcon}
                icon={<FilterIcon />}
              >
                {filterType}
              </DropdownToggle>
            }
            isOpen={isFilterTypeDropdownOpen}
            dropdownItems={[
              <DropdownItem
                data-testid="filter-type-dropdown-item"
                key="filter-type"
              >
                {filterType === "Name" ? t("protocol") : t("common:name")}
              </DropdownItem>,
            ]}
          />
        }
        key={key}
        toolbarItem={
          filterType === "Protocol" && (
            <>
              <Dropdown
                onSelect={() => {
                  onFilterTypeDropdownSelect(filterType);
                }}
                data-testid="filter-type-dropdown"
                toggle={
                  <DropdownToggle
                    id="toggle-id-9"
                    onToggle={onFilterTypeDropdownToggle}
                    toggleIndicator={CaretDownIcon}
                    icon={<FilterIcon />}
                  >
                    {filterType}
                  </DropdownToggle>
                }
                isOpen={isFilterTypeDropdownOpen}
                dropdownItems={[
                  <DropdownItem
                    data-testid="filter-type-dropdown-item"
                    key="filter-type"
                  >
                    {t("common:name")}
                  </DropdownItem>,
                ]}
              />
              <Select
                variant={SelectVariant.single}
                className="kc-protocolType-select"
                aria-label="Select Input"
                onToggle={onProtocolTypeDropdownToggle}
                onSelect={(_, value) =>
                  onProtocolTypeDropdownSelect(value.toString())
                }
                selections={protocolType}
                isOpen={isProtocolTypeDropdownOpen}
                direction={SelectDirection.down}
              >
                {protocolTypeOptions}
              </Select>
            </>
          )
        }
        canSelectAll
        onSelect={(rows) => setRows(rows)}
        columns={[
          {
            name: "name",
          },
          { name: "protocol", displayKey: "Protocol" },
          {
            name: "description",
          },
        ]}
      />
    </Modal>
  );
};
