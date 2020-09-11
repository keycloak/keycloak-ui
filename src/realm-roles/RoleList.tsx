import React from "react";
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

type RolesListProps = {
  roles?: RoleRepresentation[];
};

const columns: (keyof RoleRepresentation)[] = [
  "name",
  "composite",
  "description",
];

export const RolesList = ({ roles }: RolesListProps) => {
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

  const data = roles!.map((c) => {
    return { cells: columns.map((col) => c[col]) };
  });
  return (
    <Table
      variant={TableVariant.compact}
      cells={[
        {
          title: "Role name",
          cellFormatters: [externalLink(), emptyFormatter()],
        },
        {
          title: "Composite",
          cellFormatters: [boolFormatter(), emptyFormatter()],
        },
        { title: "Description", cellFormatters: [emptyFormatter()] },
      ]}
      rows={data}
      aria-label="Roles list"
    >
      <TableHeader />
      <TableBody />
    </Table>
  );
};
