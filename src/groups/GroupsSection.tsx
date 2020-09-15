import React, {useState} from "react";
import { useTranslation } from "react-i18next";
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

export const GroupsSection = () => {

  // Data
  const columnData = [
    { title: 'Group name' },
    { title: 'Members' },
  ];

  const rowData = [
    { cells: 
      ['IT-1', 
      <React.Fragment>
        <div className="pf-icon-group-members">
          <UsersIcon />
          <span>732</span>
        </div>
      </React.Fragment>
      ]
    },
    { cells: 
      ['IT-2', '583'] 
    },
    { cells: 
      ['IT-3', '762'] 
    },
    { cells: 
      ['3scale-group', '762'] 
    },
    { cells: 
      ['Fuse-group', '762'] 
    },
    { cells: 
      ['Apicurio-group', '762'] 
    }
  ];

  const actionData = [
    {
      title: 'Some action',
      onClick: (event, rowId, rowData, extra) => console.log('clicked on Some action, on row: ', rowId)
    },
    {
      title: 'Another action',
      onClick: (event, rowId, rowData, extra) => console.log('clicked on Some action, on row: ', rowId)
    }
  ];

  // States
  const [columns, setColumns] = useState(columnData);
  const [rows, setRows] = useState(rowData);
  const [actions, setActions] = useState(actionData);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(20);
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  
  const { t } = useTranslation();

  // FUNCTIONS

  // Table row
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

  // Pagination
  const onSetPage = (_event, pageNumber) => {
    setPage(pageNumber);
  };

  const onPerPageSelect = (_event, perPage) => {
    setPerPage(perPage);
  };

  // Filter
  const filterGroups = (newInput: string) => {
    var localRowData: object[] = [];
    rowData.forEach(function(obj) {
      var groupName = Object.values(obj)[0][0];
      if (groupName.toLowerCase().includes(newInput.toLowerCase())) {
        localRowData.push(obj);
      }
    });
    console.log(localRowData);
    setRows(localRowData);
  }

  // Kebab delete action
  const onKebabToggle = isOpen => {
    setIsKebabOpen(isOpen);
  };

  // Components
  const deleteKebabItems = (
    <DropdownItem key="action" component="button">
      Delete
    </DropdownItem>
  );

  const toolbarItems = (
    <React.Fragment>
      <ToolbarItem>
        <InputGroup>
          <TextInput
            name="textInput1"
            id="textInput1"
            type="search"
            aria-label="search input example"
            placeholder="Search groups"
            onChange={filterGroups}
          />
          <Button variant={ButtonVariant.control} aria-label="search button for search input">
            <SearchIcon />
          </Button>
        </InputGroup>
      </ToolbarItem>
      <ToolbarItem>
        <Button variant="primary">Create group</Button>
      </ToolbarItem>
      <ToolbarItem>
        <Dropdown
          toggle={<KebabToggle onToggle={onKebabToggle} />}
          isOpen={isKebabOpen}
          isPlain
          dropdownItems={deleteKebabItems}
        />
        </ToolbarItem>
      <ToolbarItem variant="pagination">
        <Pagination
          itemCount={523}
          perPage={perPage}
          page={page}
          onSetPage={onSetPage}
          widgetId="pagination-options-menu-top"
          onPerPageSelect={onPerPageSelect}
        />
      </ToolbarItem>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h3" size={TitleSizes['2xl']}>
          {t("Groups")}
        </Title>
      </PageSection>
      <Divider/>
      <PageSection>
        <Toolbar id="toolbar">
          <ToolbarContent>
            {toolbarItems}
          </ToolbarContent>
        </Toolbar>
        <Table
          actions={actions}
          variant={TableVariant.compact}
          onSelect={onSelect}
          canSelectAll={false}
          aria-label="Selectable Table"
          cells={columns}
          rows={rows}>
          <TableHeader />
          <TableBody />
        </Table>
      </PageSection>
    </React.Fragment>
  );
};
