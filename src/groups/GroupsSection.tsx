import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";
import { HttpClientContext } from "../http-service/HttpClientContext";
import { GroupsList } from "./GroupsList";
import { DataLoader } from "../components/data-loader/DataLoader";
import { GroupRepresentation } from "./models/groups";
import { TableToolbar } from "../components/table-toolbar/TableToolbar";
import {
  Button,
  ButtonVariant,
  Flex,
  InputGroup,
  TextInput,
  Divider,
  Dropdown,
  DropdownItem,
  KebabToggle,
  PageSection,
  PageSectionVariants,
  Pagination,
  PaginationVariant,
  Title,
  TitleSizes,
  Toolbar,
  ToolbarItem,
  ToolbarContent
} from '@patternfly/react-core';
import {
  Table,
  TableHeader,
  TableBody,
  TableVariant
} from '@patternfly/react-table';
import { SearchIcon } from '@patternfly/react-icons';
import { UsersIcon } from '@patternfly/react-icons';
import './GroupsSection.css';
import groupMock from "./__tests__/mock-groups.json";

export const GroupsSection = ({formattedData}) => {

  console.log('what is formatted data' + formattedData);

  const loader = async () => {
    return await httpClient
    .doGet("/admin/realms/master/groups", { params: { first, max } })
    .then((r) => r.data as GroupRepresentation[]);
  };

  const { t } = useTranslation("groups");
  const history = useHistory();
  const httpClient = useContext(HttpClientContext)!;
  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [data, setData] = useState(formattedData);
  const [filteredData, setFilteredData] = useState([{}]);
  // const [searchText, setSearchText] = useState('');

  // const initialData = groupMock.map((c) => {
  //   var groupName = c["name"];
  //   var groupNumber = c["groupNumber"];
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

  // useEffect(() => {
  //   setData(
  //     [{ cells: [ "hi", "hi"] }]
  //   )

  //   // groupMock.map((c) => {
  //   //   var groupName = c["name"];
  //   //   var groupNumber = c["groupNumber"];
  //   //   return { cells: [
  //   //     <Button variant="link" isInline>
  //   //       {groupName}
  //   //     </Button>,
  //   //       <div className="pf-icon-group-members">
  //   //         <UsersIcon />
  //   //         {groupNumber}
  //   //       </div>
  //   //   ], selected: false};
  //   // });

  // }, [data]);


  // Filter
  const filterGroups = (newInput: string) => {
    var localRowData: object[] = [{}];
      data.forEach(function(obj: {}) {
        console.log('WHAT IS D' + Object.values(obj)[0][0]);
        var groupName = Object.values(obj)[0][0].innerText;
        var groupName2 = groupName[0];
        var groupName3 = groupName2[0].innerText;
        console.log('what is the groupname' + groupName + typeof(groupName));
        if (groupName.toLowerCase().includes(newInput.toLowerCase())) {
          localRowData.push(obj);
          console.log('what is the LOCAL row data' + localRowData);
      }
    })
    console.log('what is the local row data' + localRowData + 'AND DOES IT GET HERE');
    setFilteredData(localRowData);
  };

  function onSelect(event, isSelected, rowId) {
    let localRow;
    if (rowId === -1) {
      localRow = data.map(oneRow => {
        oneRow.selected = isSelected;
        return oneRow;
      });
    } else {
      localRow = [...data];
      localRow[rowId].selected = isSelected;
    }
    setData(localRow);
  }

  function deleteRowData() {
    let localData = data;
    localData.map((row, index) => {
      console.log('what is the row' + row.selected);
      if(row.selected === true) {
        delete localData[index];
        // newRows.push(row);
      }
    })
    setData(localData);
  }

  // Kebab delete action
  const onKebabToggle = (isOpen: boolean) => {
    setIsKebabOpen(isOpen);
  };

  const onKebabSelect = (event) => {
    setIsKebabOpen(!isKebabOpen);
  };

  function handleDeleteGroup(rowId) {
    console.log('The row to be deleted is' + rowId);
  }



  // const tryThis = [
  //   let cellsArray = [];
  //   groupMock.map((row) => {
  //     cellsArray.push({ cells: [ row["groupName"], row["groupNumber"] ]})
  //   })
  //   return cellsArray;
  // ];

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h3" size={TitleSizes['2xl']}>
          {t("Groups")}
        </Title>
      </PageSection>
      <Divider/>
      {/* <DataLoader loader={loader}>
      {(groups) => ( */}
          <TableToolbar
            count={10}
            first={first}
            max={max}
            onNextClick={setFirst}
            onPreviousClick={setFirst}
            onPerPageSelect={(f,m) => {
              setFirst(f);
              setMax(m);
            }}
            toolbarItem={
              <>
              <ToolbarItem>
                <Button variant="primary">{t("Create group")}</Button>
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  onSelect={onKebabSelect}
                  toggle={<KebabToggle onToggle={onKebabToggle} />}
                  isOpen={isKebabOpen}
                  isPlain
                  dropdownItems={[
                    <DropdownItem key="action" component="button" onClick={deleteRowData}>
                      {t("Delete")}
                    </DropdownItem>
                  ]}
                />
                </ToolbarItem>
              {/* <Button onClick={() => history.push("/add-group")}>
                {t("Create group")}
              </Button> */}
              </>
            }
            inputGroup={
              <InputGroup>
                <TextInput
                  name="textInput1"
                  id="textInput1"
                  type="search"
                  // value={searchText}
                  aria-label={t("Search for groups")}
                  placeholder={t("Search groups")}
                  onChange={filterGroups}
                />
                <Button variant={ButtonVariant.control} aria-label={t("Search")}>
                  <SearchIcon />
                </Button>
              </InputGroup>
            }
          >
            {/* <GroupsList list={data} /> */}
            <Table
              actions={actions}
              variant={TableVariant.compact}
              onSelect={onSelect}
              canSelectAll={false}
              aria-label="Selectable Table"
              cells={tableHeader}
              rows={data}>
              <TableHeader />
              <TableBody />
            </Table>
          </TableToolbar>
      {/* )}
      </DataLoader> */}
    </React.Fragment>
  );
};
