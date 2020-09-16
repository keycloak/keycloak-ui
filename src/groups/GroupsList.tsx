import React, {useState} from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant
} from '@patternfly/react-table';
import {
  Button
} from '@patternfly/react-core';
import { useTranslation } from "react-i18next";
import { GroupRepresentation } from "./models/groups";
import { UsersIcon } from '@patternfly/react-icons';

type GroupsListProps = {
  list: GroupRepresentation[];
}

export const GroupsList = ({ list }: GroupsListProps ) => {
  const { t } = useTranslation("group");
  const columnGroupName: (keyof GroupRepresentation) = "name";
  const columnGroupNumber: (keyof GroupRepresentation) = "groupNumber";

  const data = list.map((c) => {
    var groupName = c[columnGroupName];
    var groupNumber = c[columnGroupNumber];
    return { cells: [
      <Button variant="link" isInline>
        {groupName}
      </Button>,
        <div className="pf-icon-group-members">
          <UsersIcon />
          {groupNumber}
        </div>
    ]};
  });

  // States
  const [rows, setRows] = useState(data);

  const tableHeader = [
    { title: t("Group name") },
    { title: t("Members") },
  ];

  const actions = [
    {
      title: 'Some action',
      onClick: (event, rowId, rowData, extra) => console.log('clicked on Some action, on row: ', rowId)
    },
    {
      title: 'Another action',
      onClick: (event, rowId, rowData, extra) => console.log('clicked on Some action, on row: ', rowId)
    }
  ];

  // FUNCTIONS
  function onSelect(event, isSelected, rowId) {
    let localRow;
    if (rowId === -1) {
      localRow = rows.map(oneRow => {
        oneRow.selected = isSelected;
        return oneRow;
      });
    } else {
      localRow = [...rows];
      localRow[rowId].selected = isSelected;
    }
    setRows(rows);
  }

  return (
    <Table
      actions={actions}
      variant={TableVariant.compact}
      onSelect={onSelect}
      canSelectAll={false}
      aria-label="Selectable Table"
      cells={tableHeader}
      rows={rows}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};
