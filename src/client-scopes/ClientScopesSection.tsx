import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  KebabToggle,
  PageSection,
  ToolbarItem,
} from "@patternfly/react-core";
import { cellWidth } from "@patternfly/react-table";

import { useAdminClient } from "../context/auth/AdminClient";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAlerts } from "../components/alert/Alerts";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { useRealm } from "../context/realm-context/RealmContext";
import { upperCaseFormatter, emptyFormatter } from "../util";
import {
  CellDropdown,
  ClientScope,
  AllClientScopes,
  ClientScopeDefaultOptionalType,
  changeScope,
  removeScope,
} from "../components/client-scope/ClientScopeTypes";
import { ChangeTypeDialog } from "./ChangeTypeDialog";
import { toNewClientScope } from "./routes/NewClientScope";

import "./client-scope.css";
import { toClientScope } from "./routes/ClientScope";
import { useWhoAmI } from "../context/whoami/WhoAmI";
import {
  nameFilter,
  protocolFilter,
  ProtocolType,
  SearchDropdown,
  SearchToolbar,
  SearchType,
  typeFilter,
} from "./details/SearchFilter";
import type { Row } from "../clients/scopes/ClientScopes";

export const ClientScopesSection = () => {
  const { realm } = useRealm();
  const { whoAmI } = useWhoAmI();
  const { t } = useTranslation("client-scopes");

  const adminClient = useAdminClient();
  const { addAlert, addError } = useAlerts();

  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  const [kebabOpen, setKebabOpen] = useState(false);
  const [changeTypeOpen, setChangeTypeOpen] = useState(false);
  const [selectedScopes, setSelectedScopes] = useState<
    ClientScopeDefaultOptionalType[]
  >([]);

  const [searchType, setSearchType] = useState<SearchType>("name");
  const [searchTypeType, setSearchTypeType] = useState<AllClientScopes>(
    AllClientScopes.none
  );
  const [searchProtocol, setSearchProtocol] = useState<ProtocolType>("all");

  const loader = async (first?: number, max?: number, search?: string) => {
    const defaultScopes =
      await adminClient.clientScopes.listDefaultClientScopes();
    const optionalScopes =
      await adminClient.clientScopes.listDefaultOptionalClientScopes();
    const clientScopes = await adminClient.clientScopes.find();

    const filter =
      searchType === "name"
        ? nameFilter(search)
        : searchType === "type"
        ? typeFilter(searchTypeType)
        : protocolFilter(searchProtocol);

    return clientScopes
      .map((scope) => {
        return {
          ...scope,
          type: defaultScopes.find(
            (defaultScope) => defaultScope.name === scope.name
          )
            ? ClientScope.default
            : optionalScopes.find(
                (optionalScope) => optionalScope.name === scope.name
              )
            ? ClientScope.optional
            : AllClientScopes.none,
        } as Row;
      })
      .filter(filter)
      .sort((a, b) => a.name!.localeCompare(b.name!, whoAmI.getLocale()))
      .slice(first, max);
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteClientScope", {
      count: selectedScopes.length,
      name: selectedScopes[0]?.name,
    }),
    messageKey: "client-scopes:deleteConfirm",
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        for (const scope of selectedScopes) {
          try {
            await removeScope(adminClient, scope);
          } catch (error: any) {
            console.warn(
              "could not remove scope",
              error.response?.data?.errorMessage || error
            );
          }
          await adminClient.clientScopes.del({ id: scope.id! });
        }
        addAlert(t("deletedSuccess"), AlertVariant.success);
        refresh();
      } catch (error) {
        addError("client-scopes:deleteError", error);
      }
    },
  });

  const TypeSelector = (scope: ClientScopeDefaultOptionalType) => (
    <CellDropdown
      clientScope={scope}
      type={scope.type}
      all
      onSelect={async (value) => {
        try {
          await changeScope(adminClient, scope, value);
          addAlert(t("clientScopeSuccess"), AlertVariant.success);
          refresh();
        } catch (error) {
          addError("client-scopes:clientScopeError", error);
        }
      }}
    />
  );

  const ClientScopeDetailLink = ({
    id,
    type,
    name,
  }: ClientScopeDefaultOptionalType) => (
    <Link
      key={id}
      to={toClientScope({ realm, id: id!, type, tab: "settings" })}
    >
      {name}
    </Link>
  );
  return (
    <>
      <DeleteConfirm />
      {changeTypeOpen && (
        <ChangeTypeDialog
          selectedClientScopes={selectedScopes.length}
          onConfirm={(type) => {
            selectedScopes.map(async (scope) => {
              try {
                await changeScope(adminClient, scope, type);
                addAlert(t("clientScopeSuccess"), AlertVariant.success);
                refresh();
              } catch (error) {
                addError("client-scopes:clientScopeError", error);
              }
            });
            setChangeTypeOpen(false);
          }}
          onClose={() => setChangeTypeOpen(false)}
        />
      )}
      <ViewHeader
        titleKey="clientScopes"
        subKey="client-scopes:clientScopeExplain"
      />
      <PageSection variant="light" className="pf-u-p-0">
        <KeycloakDataTable
          key={key}
          loader={loader}
          ariaLabelKey="client-scopes:clientScopeList"
          searchPlaceholderKey={
            searchType === "name" ? "client-scopes:searchFor" : undefined
          }
          isSearching={searchType !== "name"}
          searchTypeComponent={
            <SearchDropdown
              searchType={searchType}
              onSelect={(searchType) => setSearchType(searchType)}
              withProtocol
            />
          }
          isPaginated
          onSelect={(clientScopes) => setSelectedScopes([...clientScopes])}
          canSelectAll
          toolbarItem={
            <>
              <SearchToolbar
                searchType={searchType}
                type={searchTypeType}
                onSelect={(searchType) => setSearchType(searchType)}
                onType={(value) => {
                  setSearchTypeType(value);
                  refresh();
                }}
                protocol={searchProtocol}
                onProtocol={(protocol) => {
                  setSearchProtocol(protocol);
                  refresh();
                }}
              />

              <ToolbarItem>
                {/* @ts-ignore */}
                <Button component={Link} to={toNewClientScope({ realm })}>
                  {t("createClientScope")}
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  toggle={
                    <KebabToggle onToggle={() => setKebabOpen(!kebabOpen)} />
                  }
                  isOpen={kebabOpen}
                  isPlain
                  dropdownItems={[
                    <DropdownItem
                      key="changeType"
                      component="button"
                      isDisabled={selectedScopes.length === 0}
                      onClick={() => {
                        setChangeTypeOpen(true);
                        setKebabOpen(false);
                      }}
                    >
                      {t("changeType")}
                    </DropdownItem>,

                    <DropdownItem
                      key="action"
                      component="button"
                      isDisabled={selectedScopes.length === 0}
                      onClick={() => {
                        toggleDeleteDialog();
                        setKebabOpen(false);
                      }}
                    >
                      {t("common:delete")}
                    </DropdownItem>,
                  ]}
                />
              </ToolbarItem>
            </>
          }
          actions={[
            {
              title: t("common:export"),
            },
            {
              title: t("common:delete"),
              onRowClick: (clientScope) => {
                setSelectedScopes([clientScope]);
                toggleDeleteDialog();
              },
            },
          ]}
          columns={[
            {
              name: "name",
              cellRenderer: ClientScopeDetailLink,
            },
            {
              name: "type",
              displayKey: "client-scopes:assignedType",
              cellRenderer: TypeSelector,
            },
            {
              name: "protocol",
              displayKey: "client-scopes:protocol",
              cellFormatters: [upperCaseFormatter()],
              transforms: [cellWidth(15)],
            },
            {
              name: "attributes['gui.order']",
              displayKey: "client-scopes:displayOrder",
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(15)],
            },
            { name: "description", cellFormatters: [emptyFormatter()] },
          ]}
        />
      </PageSection>
    </>
  );
};
