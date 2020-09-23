import React, { useContext, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { HttpClientContext } from "../http-service/HttpClientContext";
import { GroupsList } from "./GroupsList";
import { GroupRepresentation } from "./models/groups";
import { ServerInfoRepresentation, ServerGroupsRepresentation } from "./models/server-info";
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
import './GroupsSection.css';

export const GroupsSection = () => {

  const { t } = useTranslation("groups");
  const httpClient = useContext(HttpClientContext)!;
  const [rawData, setRawData] = useState();
  const [filteredData, setFilteredData] = useState();
  const [max, setMax] = useState(10);
  const [first, setFirst] = useState(0);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const columnID: (keyof GroupRepresentation) = "id";
  const membersLength: (keyof GroupRepresentation) = "membersLength";
  const columnGroupName: (keyof GroupRepresentation) = "name";

  const loader = async () => {
    const groups = await httpClient.doGet("/admin/realms/master/groups", { params: { first, max } });
    const groupsData = await groups.data;

    const getMembers = async (id: number) => {
      const response = await httpClient.doGet(`/admin/realms/master/groups/${id}/members`);
      const responseData: any = response.data;
      return responseData.length;
    }
    const memberPromises = groupsData.map((group: {}) => getMembers(group[columnID]));
    const memberData = await Promise.all(memberPromises);
    const updatedObject = groupsData.map((group: {}, i: number) => {
      const object = Object.assign({}, group);
      object[membersLength] = memberData[i];
      return object;
    })
    return updatedObject;
  };

  useEffect(() => {
    loader().then(data => {
      data && 
      setRawData(data);
      setFilteredData(data);
    })
  }, [])


  // Filter groups
  const filterGroups = (newInput: string, event: React.FormEvent<HTMLInputElement>) => {
    var localRowData: object[] = [];
    rawData.forEach(function(obj: {}) {
      var groupName = obj[columnGroupName];
      if (groupName.toLowerCase().includes(newInput.toLowerCase())) {
        localRowData.push(obj);
      }
    })
    setFilteredData(localRowData);
  };

  // Kebab delete action
  const onKebabToggle = (isOpen: boolean) => {
    setIsKebabOpen(isOpen);
  };

  const onKebabSelect = (event: React.MouseEvent) => {
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
            inputGroupName="groupsToolbarTextInput"
            inputGroupPlaceholder="Search groups"
            inputGroupOnChange={filterGroups}
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
                    <DropdownItem key="action" component="button">
                      {t("Delete")}
                    </DropdownItem>
                  ]}
                />
                </ToolbarItem>
              </>
            }
          >
            { rawData && filteredData &&
              <GroupsList list={filteredData ? filteredData : rawData} />
            }
          </TableToolbar>
      </PageSection>
    </React.Fragment>
  );
};
