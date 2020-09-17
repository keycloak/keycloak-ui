import React, {useState, useEffect} from "react";
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

  console.log('what is the list coming in' + list);

  const { t } = useTranslation("group");
  const columnGroupName: (keyof GroupRepresentation) = "name";
  const columnGroupNumber: (keyof GroupRepresentation) = "groupNumber";

  const [templateData, setTemplateData] = useState([{}])

  // const data = list.map((c) => {
  //   var groupName = c[columnGroupName];
  //   var groupNumber = c[columnGroupNumber];
  //   return { cells: [
  //     <Button variant="link" isInline>
  //       {groupName}
  //     </Button>,
  //       <div className="pf-icon-group-members">
  //         <UsersIcon />
  //         {groupNumber}
  //       </div>
  //   ], selected: false};
  // });

  // useEffect(() => {
  //   setTemplateData(data);
  // }, []);

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
  // function onSelect(event, isSelected, rowId) {
  //   let localRow;
  //   if (rowId === -1) {
  //     console.log('does rowdid = -1');
  //     localRow = data.map(oneRow => {
  //       oneRow.selected = isSelected;
  //       return oneRow;
  //     });
  //   } else {
  //     console.log('does rowdid not = -1');
  //     localRow = [...data];
  //     console.log('what is local row row id' + localRow[rowId].selected);
  //     localRow[rowId].selected = isSelected;
  //   }
  //   console.log('what is LOCALROW after' + localRow[0].selected + localRow[1].selected + data[2].selected);
  //   console.log('what is data after' + data[0].selected + data[1].selected + data[2].selected);
  //   return data;
  // }

  return (
    <Table
      actions={actions}
      variant={TableVariant.compact}
      //onSelect={onSelect}
      canSelectAll={false}
      aria-label="Selectable Table"
      cells={tableHeader}
      rows={list}>
      <TableHeader />
      <TableBody />
    </Table>
  );
};
