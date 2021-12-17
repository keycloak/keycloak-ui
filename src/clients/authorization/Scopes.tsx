import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  Alert,
  AlertVariant,
  Button,
  PageSection,
  ToolbarItem,
} from "@patternfly/react-core";
import {
  ExpandableRowContent,
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import type ResourceServerRepresentation from "@keycloak/keycloak-admin-client/lib/defs/resourceServerRepresentation";
import type ResourceRepresentation from "@keycloak/keycloak-admin-client/lib/defs/resourceRepresentation";
import { KeycloakSpinner } from "../../components/keycloak-spinner/KeycloakSpinner";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";
import { PaginatingTableToolbar } from "../../components/table-toolbar/PaginatingTableToolbar";
import { useAdminClient, useFetch } from "../../context/auth/AdminClient";
import { useAlerts } from "../../components/alert/Alerts";
import { toCreateResource } from "../routes/NewResource";
import { useRealm } from "../../context/realm-context/RealmContext";
import { toResourceDetails } from "../routes/Resource";
import type ScopeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/scopeRepresentation";

type ScopesProps = {
  clientId: string;
};

type ExpandableScopeRepresentation = ScopeRepresentation & {
  isExpanded: boolean;
};

export const AuthorizationScopes = ({ clientId }: ScopesProps) => {
  const { t } = useTranslation("clients");
  const adminClient = useAdminClient();
  const { addAlert, addError } = useAlerts();
  const { realm } = useRealm();

  const [scopes, setScopes] = useState<ExpandableScopeRepresentation[]>();
  const [selectedScope, setSelectedScope] = useState<ResourceRepresentation>();
  const [permissions, setPermission] =
    useState<ResourceServerRepresentation[]>();

  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);

  useFetch(
    () => {
      const params = {
        first,
        max,
        deep: false,
      };
      return adminClient.clients.listAllScopes({
        ...params,
        id: clientId,
      });
    },
    (scopes) =>
      setScopes(scopes.map((scope) => ({ ...scope, isExpanded: false }))),
    [key]
  );

  const fetchResources = async (id: string) => {
    return adminClient.clients.listPermissionsByResource({
      id: clientId,
      resourceId: id,
    });
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "clients:deleteResource",
    children: (
      <>
        {t("deleteResourceConfirm")}
        {permissions?.length && (
          <Alert
            variant="warning"
            isInline
            isPlain
            title={t("deleteResourceWarning")}
            className="pf-u-pt-lg"
          >
            <p className="pf-u-pt-xs">
              {permissions.map((permission) => (
                <strong key={permission.id} className="pf-u-pr-md">
                  {permission.name}
                </strong>
              ))}
            </p>
          </Alert>
        )}
      </>
    ),
    continueButtonLabel: "clients:confirm",
    onConfirm: async () => {
      try {
        await adminClient.clients.delResource({
          id: clientId,
          resourceId: selectedScope?._id!,
        });
        addAlert(t("resourceDeletedSuccess"), AlertVariant.success);
        refresh();
      } catch (error) {
        addError("clients:resourceDeletedError", error);
      }
    },
  });

  if (!scopes) {
    return <KeycloakSpinner />;
  }

  return (
    <PageSection variant="light" className="pf-u-p-0">
      <DeleteConfirm />
      <PaginatingTableToolbar
        count={scopes.length}
        first={first}
        max={max}
        onNextClick={setFirst}
        onPreviousClick={setFirst}
        onPerPageSelect={(first, max) => {
          setFirst(first);
          setMax(max);
        }}
        toolbarItem={
          <ToolbarItem>
            <Button
              data-testid="createResource"
              component={(props) => (
                <Link
                  {...props}
                  to={toCreateResource({ realm, id: clientId })}
                />
              )}
            >
              {t("createResource")}
            </Button>
          </ToolbarItem>
        }
      >
        <TableComposable aria-label={t("resources")} variant="compact">
          <Thead>
            <Tr>
              <Th />
              <Th>{t("common:name")}</Th>
              <Th />
            </Tr>
          </Thead>
          {scopes.map((scope, rowIndex) => (
            <Tbody key={scope.id} isExpanded={scope.isExpanded}>
              <Tr>
                <Td
                  expand={{
                    rowIndex,
                    isExpanded: scope.isExpanded,
                    onToggle: (_, rowIndex) => {
                      const rows = scopes.map((resource, index) =>
                        index === rowIndex
                          ? { ...resource, isExpanded: !resource.isExpanded }
                          : resource
                      );
                      setScopes(rows);
                    },
                  }}
                />
                <Td data-testid={`name-column-${scope.name}`}>
                  <Link
                    to={toResourceDetails({
                      realm,
                      id: clientId,
                      resourceId: scope.id!,
                    })}
                  >
                    {scope.name}
                  </Link>
                </Td>
                <Td
                  actions={{
                    items: [
                      {
                        title: t("common:delete"),
                        onClick: async () => {
                          setSelectedScope(scope);
                          setPermission(await fetchResources(scope.id!));
                          toggleDeleteDialog();
                        },
                      },
                      {
                        title: t("createPermission"),
                        className: "pf-m-link",
                        isOutsideDropdown: true,
                      },
                    ],
                  }}
                />
              </Tr>
              <Tr key={`child-${scope.id}`} isExpanded={scope.isExpanded}>
                <Td colSpan={5}>
                  <ExpandableRowContent>
                    {/* {scope.isExpanded && (
                      <DetailCell
                        clientId={clientId}
                        id={scope.id!}
                        uris={scope.uris}
                      />
                    )} */}
                  </ExpandableRowContent>
                </Td>
              </Tr>
            </Tbody>
          ))}
        </TableComposable>
      </PaginatingTableToolbar>
    </PageSection>
  );
};
