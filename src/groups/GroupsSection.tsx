import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HttpClientContext } from "../http-service/HttpClientContext";
import { GroupsList } from "./GroupsList";
import { DataLoader } from "../components/data-loader/DataLoader";
import { GroupRepresentation } from "./models/groups";
import { TableToolbar } from "../components/table-toolbar/TableToolbar";
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
import { SearchIcon } from '@patternfly/react-icons';
import { UsersIcon } from '@patternfly/react-icons';
import './GroupsSection.css';

type GroupsSectionProps = {
  data: []
}

export const GroupsSection = ({data}: GroupsSectionProps) => {

  // TO DO: Use loader
  const loader = async () => {
    return await httpClient
    .doGet("/admin/realms/master/groups", { params: { first, max } })
    .then((r) => r.data as GroupRepresentation[]);
  };

  const [rawData, setRawData] = useState(data);
  const [filteredData, setFilteredData] = useState(rawData);
  const { t } = useTranslation("groups");
  const httpClient = useContext(HttpClientContext)!;
  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const columnGroupName: (keyof GroupRepresentation) = "name";
  const columnGroupNumber: (keyof GroupRepresentation) = "groupNumber";

  // On first load pass through formatted data into the list
  const initialFormattedData = rawData.map((column: {}) => {
      var groupName = column[columnGroupName];
      var groupNumber = column[columnGroupNumber];
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

  const [formattedData, setFormattedData] = useState(initialFormattedData);

  // Format function
  const formatData = (dataToFormat:[]) => {
    const format = dataToFormat.map((column) => {
      var groupName = column[columnGroupName];
      var groupNumber = column[columnGroupNumber];
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
    setFormattedData(format);
  }

  // Call format function when raw data or filtered data changes
  useEffect(() => {
    formatData(rawData);
  }, [rawData])

  useEffect(() => {
    formatData(filteredData);
  }, [filteredData])


  // Filter groups
  const filterGroups = (newInput: string) => {
    var localRowData: object[] = [];
    rawData.forEach(function(obj: {}) {
        var groupName = Object.values(obj)[0];
        if (groupName.toLowerCase().includes(newInput.toLowerCase())) {
          localRowData.push(obj);
      }
    })
    setFilteredData(localRowData);
  };

  function onSelect(_, isSelected: boolean, rowId: number) {
    let localRow;
    if (rowId === -1) {
      localRow = data.map(oneRow => {
        oneRow.selected = isSelected;
        return oneRow;
      });
    } else {
      localRow = [...formattedData];
      localRow[rowId].selected = isSelected;
    }
    setFormattedData(localRow);
  }

  // Delete multiple rows using the delete button in the toolbar
  function deleteRowData() {
    var localFilteredData = [...rawData];
    var selectedIndexArray: [] = [];
    formattedData.map((row: {}, index: number) => {
      if(row.selected === true) {
        selectedIndexArray.push(index);
      }
    })
    if(selectedIndexArray.length > 0) {
      var count = 0;
      selectedIndexArray.map((rowIndex) => {
        localFilteredData.splice((rowIndex - count), 1);
        count++;
      })
    }
    setRawData(localFilteredData);
  }

  // Delete individual rows using the action in the table
  function onDelete(_, rowId: number) {
    var localFilteredData = [...rawData];
    localFilteredData.splice(rowId, 1);
    setRawData(localFilteredData);
  }

  // Kebab delete action
  const onKebabToggle = (isOpen: boolean) => {
    setIsKebabOpen(isOpen);
  };

  const onKebabSelect = (event) => {
    setIsKebabOpen(!isKebabOpen);
  };


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
              </>
            }
            inputGroup={
              <InputGroup>
                <TextInput
                  name="textInput1"
                  id="textInput1"
                  type="search"
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
            <GroupsList list={formattedData} onSelect={onSelect} onDelete={onDelete} />
          </TableToolbar>
      {/* )}
      </DataLoader> */}
    </React.Fragment>
  );
};
