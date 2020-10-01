import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

import {
  Table,
  TableBody,
  TableHeader,
  TableVariant,
  IFormatter,
  IFormatterValueType,
} from "@patternfly/react-table";

import { ExternalLink } from "../components/external-link/ExternalLink";
import { RoleRepresentation } from "../model/role-model";
import { AlertVariant } from "@patternfly/react-core";
import { HttpClientContext } from "../context/http-service/HttpClientContext";
import { useAlerts } from "../components/alert/Alerts";
import { RealmContext } from "../context/realm-context/RealmContext";

type RolesListProps = {
  roles?: RoleRepresentation[];
  refresh: () => void;
};

const columns: (keyof RoleRepresentation)[] = [
  "name",
  "composite",
  "description",
];

export const RolesList = ({ roles, refresh }: RolesListProps) => {
  const { t } = useTranslation("roles");
  const httpClient = useContext(HttpClientContext)!;
  const { realm } = useContext(RealmContext);
<<<<<<< HEAD
  const { addAlert } = useAlerts();
=======
  const [addAlert, Alerts] = useAlerts();
>>>>>>> add logic to delete realm role

  const emptyFormatter = (): IFormatter => (data?: IFormatterValueType) => {
    return data ? data : "—";
  };

  const externalLink = (): IFormatter => (data?: IFormatterValueType) => {
    return (data ? (
      <ExternalLink href={data.toString()} />
    ) : undefined) as object;
  };

  const boolFormatter = (): IFormatter => (data?: IFormatterValueType) => {
    const boolVal = data?.toString();

    return (boolVal
      ? boolVal.charAt(0).toUpperCase() + boolVal.slice(1)
      : undefined) as string;
  };
  const data = roles!.map((column) => {
    return { cells: columns.map((col) => column[col]), role: column };
  });
  return (
    <>
      <Table
        variant={TableVariant.compact}
        cells={[
          {
            title: t("roleName"),
            cellFormatters: [externalLink(), emptyFormatter()],
          },
          {
            title: t("composite"),
            cellFormatters: [boolFormatter(), emptyFormatter()],
          },
          { title: t("description"), cellFormatters: [emptyFormatter()] },
        ]}
        rows={data}
        actions={[
          {
            title: t("common:Delete"),
            onClick: async (_, rowId) => {
              try {
                await httpClient.doDelete(
                  `/admin/realms/${realm}/roles/${data[rowId].role.name}`
                );
                refresh();
                addAlert(t("roleDeletedSuccess"), AlertVariant.success);
              } catch (error) {
                addAlert(
                  `${t("roleDeleteError")} ${error}`,
                  AlertVariant.danger
                );
              }
            },
          },
        ]}
        aria-label="Roles list"
      >
        <TableHeader />
        <TableBody />
      </Table>
    </>
  );
};
