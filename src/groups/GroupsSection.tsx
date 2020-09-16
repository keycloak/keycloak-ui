import React, { useContext, useState } from "react";
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
import { SearchIcon } from '@patternfly/react-icons';
import { UsersIcon } from '@patternfly/react-icons';
import './GroupsSection.css';
import groupMock from "./__tests__/mock-groups.json";

export const GroupsSection = () => {

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
  const [data, setData] = useState(groupMock);
  // const [searchText, setSearchText] = useState('');


  // Filter
  const filterGroups = (newInput: string) => {
      var localRowData: object[] = [];
      data.forEach(function(d: {}) {
        console.log('WHAT IS D' + JSON.stringify(d)+ d["name"] );
        var groupName = d["name"];
        console.log('what is the groupname' + groupName + typeof(groupName));
        if (groupName.toLowerCase().includes(newInput.toLowerCase())) {
          localRowData.push(d);
          console.log('what is the LOCAL row data' + JSON.stringify(localRowData));
      }
    })
    console.log(localRowData);
    setData(localRowData);
  };

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
      <DataLoader loader={loader}>
        {(groups) => (
          <TableToolbar
            count={groups!.length}
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
                    <DropdownItem key="action" component="button">
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
            <GroupsList list={data} />
          </TableToolbar>
        )}
      </DataLoader>
    </React.Fragment>
  );
};
