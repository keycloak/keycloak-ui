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

type GroupsSectionProps = {
  data: []
}

export const GroupsSection = ({data}: GroupsSectionProps) => {

  const [rawData, setRawData] = useState();
  const httpClient = useContext(HttpClientContext)!;
  const [formattedData, setFormattedData] = useState(); // remove
  const [filteredData, setFilteredData] = useState();

  const loader = async () => {
    const groups = await httpClient.doGet("/admin/realms/master/groups", { params: { first, max } });
    const groupsData: [] = await groups.data;

    const getMembers = async (id) => {
      const response = await httpClient.doGet(`/admin/realms/master/groups/${id}/members`);
      return response.data.length;
    }

    const memberPromises = groupsData.map(group => getMembers(group["id"]));
    const memberData = await Promise.all(memberPromises);

    const updatedObject = groupsData.map((group, i) => {
      const object = Object.assign({}, group);
      object.membersLength = memberData[i];
      return object;
    })

    // setRawData(updatedObject);
    return updatedObject;
  };

  useEffect(() => {
    loader().then(data => {
      data && 
      setRawData(data);
      setFilteredData(data);
    })
  }, [])

  // const [rawData, setRawData] = useState(loader);

  const { t } = useTranslation("groups");

  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const columnGroupName: (keyof GroupRepresentation) = "name";
  const columnGroupNumber: (keyof GroupRepresentation) = "groupNumber";

  console.log('what is rawData' + rawData);

  // On first load pass through formatted data into the list
  // const initialFormattedData = rawData.map((column: {}) => {
  //     var groupName = column[columnGroupName];
  //     var groupNumber = column[columnGroupNumber];
  //     return { cells: [
  //       <Button variant="link" isInline>
  //         {groupName}
  //       </Button>,
  //         <div className="pf-icon-group-members">
  //           <UsersIcon />
  //           {groupNumber}
  //         </div>
  //     ], selected: false};
  // });

  // const [formattedData, setFormattedData] = useState(initialFormattedData);

  // Format function
  // const formatData = (dataToFormat:[]) => {
  //   const format = dataToFormat.map((column) => {
  //     var groupName = column[columnGroupName];
  //     var groupNumber = column[columnGroupNumber];
  //     return { cells: [
  //       <Button variant="link" isInline>
  //         {groupName}
  //       </Button>,
  //         <div className="pf-icon-group-members">
  //           <UsersIcon />
  //           {groupNumber}
  //         </div>
  //     ]};
  //   });
  //   setFormattedData(format);
  // }

  // Call format function when raw data or filtered data changes
  // useEffect(() => {
  //   formatData(rawData);
  // }, [rawData])

  // useEffect(() => {
  //   formatData(filteredData);
  // }, [filteredData])


  // Filter groups
  const filterGroups = (newInput: string) => {
    var localRowData: object[] = [];
    rawData.forEach(function(obj: {}) {
        // var groupName = Object.values(obj)[0];
        var groupName = obj["name"];
        console.log('what is groupname' + groupName);
        if (groupName.toLowerCase().includes(newInput.toLowerCase())) {
          localRowData.push(obj);
          console.log('what is local row data' + localRowData);
      }
    })
    setFilteredData(localRowData);
    console.log('WHAT IS FILTERED DATA AFTER' + JSON.stringify(filteredData));
  };

  // function onSelect(_, isSelected: boolean, rowId: number) {
  //   let localRow;
  //   if (rowId === -1) {
  //     localRow = data.map(oneRow => {
  //       oneRow.selected = isSelected;
  //       return oneRow;
  //     });
  //   } else {
  //     localRow = [...formattedData];
  //     localRow[rowId].selected = isSelected;
  //   }
  //   setFormattedData(localRow);
  // }

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
  // function onDelete(_, rowId: number) {
  //   var localFilteredData = [...rawData];
  //   localFilteredData.splice(rowId, 1);
  //   setRawData(localFilteredData);
  // }

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
      <PageSection variant={PageSectionVariants.light}>
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
                {/* {JSON.stringify(groups)} */}
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
            { rawData && filteredData &&
              <GroupsList list={filteredData ? filteredData : rawData} />
            }

          </TableToolbar>
        {/* )}
      </DataLoader>  */}
      </PageSection>
    </React.Fragment>
  );
};
