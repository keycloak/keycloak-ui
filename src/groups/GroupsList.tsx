import React, {useState, useEffect, useContext} from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant
} from '@patternfly/react-table';
import {
  Button,
  ButtonVariant,
  InputGroup,
  TextInput,
  Divider,
  Dropdown,
  DropdownItem,
  KebabToggle,
  PageSection,
  PageSectionVariants,
  Title,
  TitleSizes,
  ToolbarItem
} from '@patternfly/react-core';
import { useTranslation } from "react-i18next";
import { GroupRepresentation } from "./models/groups";
import { UsersIcon } from '@patternfly/react-icons';
import { HttpClientContext } from "../http-service/HttpClientContext";

type GroupsListProps = {
  list: GroupRepresentation[];
  onSelect: (event: React.MouseEvent<HTMLElement>, isSelect: boolean, rowId: number ) => void;
  onDelete: (event: React.MouseEvent<HTMLElement>, rowId: number) => void;
}

export const GroupsList = ({ list }: GroupsListProps ) => {

  console.log('WHAT IS THE LIST COMING In' + JSON.stringify(list));

  const [ formattedData, setFormattedData ] = useState(formatData);

  var formatData = (data) => data.map((column: {}) => {
    var groupName = column["name"];
    var groupNumber = column["membersLength"];
    return { cells: [
      <Button variant="link" isInline>
        {groupName}
      </Button>,
        <div className="pf-icon-group-members">
          <UsersIcon />
          {groupNumber}
        </div>
    ], selected: false};
  });

  useEffect(() => {
    setFormattedData(formatData(list));
  }, [list])



  const { t } = useTranslation("group");
  const httpClient = useContext(HttpClientContext)!;

  const tableHeader = [ { title: t("Group name") }, { title: t("Members") }];
  
  const actions = [
    {
      title: t("Move to"),
      onClick: () => console.log('TO DO: Add move to functionality')
    },
    {
      title: t("Delete"),
      onClick: onDelete
    }
  ];

  function onSelect(_, isSelected: boolean, rowId: number) {
    let localRow;
    if (rowId === -1) {
      localRow = formattedData.map(oneRow => {
        oneRow.selected = isSelected;
        return oneRow;
      });
    } else {
      localRow = [...formattedData];
      console.log('what is local row selectd' + localRow[rowId].selected);
      localRow[rowId].selected = isSelected;
      setFormattedData(localRow);
    }
  }

  // Delete individual rows using the action in the table
  function onDelete(_, rowId: number) {
    var localFilteredData = [...list];
    // localFilteredData.splice(rowId, 1);
    // setRawData(localFilteredData);
    console.log('what is the OBJ' + JSON.stringify(localFilteredData[rowId]));
    console.log('what is the OBJ ID' + JSON.stringify(localFilteredData[rowId].id));
    httpClient.doDelete(
      `/admin/realms/master/groups/${localFilteredData[rowId].id}`
    );
    // TO DO update the state 
  }

  return (
    <React.Fragment>
    { formattedData && 
      <Table
        actions={actions}
        variant={TableVariant.compact}
        onSelect={onSelect}
        canSelectAll={false}
        aria-label="Selectable Table"
        cells={tableHeader}
        rows={formattedData}>
        <TableHeader />
        <TableBody />
      </Table>
    }
    </React.Fragment>
  );
};
