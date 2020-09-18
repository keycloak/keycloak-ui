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

export const GroupsSection = ({data}) => {

  const loader = async () => {
    return await httpClient
    .doGet("/admin/realms/master/groups", { params: { first, max } })
    .then((r) => r.data as GroupRepresentation[]);
  };

  const [filteredData, setFilteredData] = useState(data);
  const { t } = useTranslation("groups");
  const httpClient = useContext(HttpClientContext)!;
  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const columnGroupName: (keyof GroupRepresentation) = "name";
  const columnGroupNumber: (keyof GroupRepresentation) = "groupNumber";

  const initialFormattedData = data.map((c) => {
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
      ], selected: false};
  });

  const [formattedData, setFormattedData] = useState(initialFormattedData);

  const formatData = (data) => {
    const format = data.map((c) => {
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
    setFormattedData(format);
  }

  useEffect(() => {
    formatData(filteredData);
  }, [filteredData])

  // Filter
  const filterGroups = (newInput: string) => {
    var localRowData: object[] = [{}];
    filteredData.forEach(function(obj: {}) {
        var groupName = Object.values(obj)[0];
        if (groupName.toLowerCase().includes(newInput.toLowerCase())) {
          localRowData.push(obj);
      }
    })
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
      localRow = [...formattedData];
      localRow[rowId].selected = isSelected;
    }
    setFormattedData(localRow);
  }

  // TO DO:
  function deleteRowData() {
    var localFilteredData = [...filteredData]
    formattedData.map((row, index) => {
      if(row.selected === true) {
        localFilteredData.splice(index, 1)
      }
    })
    setFilteredData(localFilteredData);
  }

  // TO DO: API to delete individual group row
  function onDelete(rowId: number) {
    console.log('DOES IT MAKE IT TO ONDELETE' + filteredData[rowId]);
    delete filteredData[rowId]
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
