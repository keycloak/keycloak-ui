import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dropdown,
  DropdownItem,
  DropdownPosition,
  KebabToggle,
  TreeViewDataItem,
} from "@patternfly/react-core";

import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { useAdminClient, useFetch } from "../../context/auth/AdminClient";
import { KeycloakSpinner } from "../../components/keycloak-spinner/KeycloakSpinner";
import { TableToolbar } from "../../components/table-toolbar/TableToolbar";
import useToggle from "../../utils/useToggle";
import { CheckableTreeView } from "./CheckableTreeView";
import { DeleteGroup } from "./DeleteGroup";
import { GroupToolbar } from "./GroupToolbar";

const GroupTreeContextMenu = ({ id }: { id: string }) => {
  const { t } = useTranslation("groups");
  const [isOpen, toggleOpen] = useToggle();

  return (
    <Dropdown
      toggle={<KebabToggle onToggle={toggleOpen} />}
      isOpen={isOpen}
      isPlain
      position={DropdownPosition.right}
      dropdownItems={[
        <DropdownItem key="edit" onClick={() => console.log("edit", id)}>
          {t("common:edit")}
        </DropdownItem>,
        <DropdownItem key="delete" onClick={() => console.log("delete")}>
          {t("common:delete")}
        </DropdownItem>,
      ]}
    />
  );
};

const mapGroup = ({
  id,
  name,
  subGroups,
}: GroupRepresentation): TreeViewDataItem => ({
  id,
  name,
  checkProps: { checked: false },
  children:
    subGroups && subGroups.length > 0 ? subGroups.map(mapGroup) : undefined,
  action: <GroupTreeContextMenu id={id!} />,
});

const filterGroup = (
  group: TreeViewDataItem,
  search: string
): TreeViewDataItem | null => {
  const name = group.name as string;
  if (name.toLowerCase().includes(search)) {
    return { ...group, defaultExpanded: true, children: undefined };
  }

  const children: TreeViewDataItem[] = [];
  if (group.children) {
    for (const g of group.children) {
      const found = filterGroup(g, search);
      if (found) children.push(found);
    }
    if (children.length > 0) {
      return { ...group, defaultExpanded: true, children };
    }
  }
  return null;
};

const filterGroups = (
  groups: TreeViewDataItem[],
  search: string
): TreeViewDataItem[] => {
  const result: TreeViewDataItem[] = [];
  groups
    .map((g) => filterGroup(g, search))
    .forEach((e) => {
      if (e !== null) result.push(e);
    });

  return result;
};

export const GroupTree = () => {
  const { t } = useTranslation("groups");
  const adminClient = useAdminClient();

  const [data, setData] = useState<TreeViewDataItem[]>();
  const [filteredData, setFilteredData] = useState<TreeViewDataItem[]>();
  const [selectedRows, setSelectedRows] = useState<GroupRepresentation[]>([]);
  const [showDelete, toggleShowDelete] = useToggle();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  useFetch(
    () =>
      adminClient.groups.find({
        briefRepresentation: false,
      }),
    (groups) => setData(groups.map(mapGroup)),
    []
  );

  return (
    <>
      <DeleteGroup
        show={showDelete}
        toggleDialog={toggleShowDelete}
        selectedRows={selectedRows}
        refresh={() => {
          refresh();
          setSelectedRows([]);
        }}
      />
      {data ? (
        <>
          <TableToolbar
            inputGroupName="test"
            inputGroupPlaceholder={t("groups:searchForGroups")}
            inputGroupOnEnter={(search) => {
              if (search === "") {
                setFilteredData(undefined);
              } else {
                setFilteredData(filterGroups(data, search));
              }
              refresh();
            }}
            toolbarItem={
              <GroupToolbar
                toggleDelete={toggleShowDelete}
                toggleCreate={() => console.log("create")}
                kebabDisabled={selectedRows.length === 0}
              />
            }
          />
          <CheckableTreeView
            key={key}
            data={filteredData || data}
            onSelect={(items) =>
              setSelectedRows(items as GroupRepresentation[])
            }
          />
        </>
      ) : (
        <KeycloakSpinner />
      )}
    </>
  );
};
