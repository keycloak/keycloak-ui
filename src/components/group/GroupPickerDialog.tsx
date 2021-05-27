import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Breadcrumb,
  BreadcrumbItem,
  Button,
  ButtonVariant,
  DataList,
  DataListAction,
  DataListCell,
  DataListCheck,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
  InputGroup,
  Modal,
  ModalVariant,
  TextInput,
  Toolbar,
  ToolbarContent,
  ToolbarItem,
} from "@patternfly/react-core";
import { AngleRightIcon, SearchIcon } from "@patternfly/react-icons";

import type GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";
import { useAdminClient, useFetch } from "../../context/auth/AdminClient";
import { ListEmptyState } from "../list-empty-state/ListEmptyState";

export type GroupPickerDialogProps = {
  id?: string;
  type: "selectOne" | "selectMany";
  filterGroups?: string[];
  text: { title: string; ok: string };
  onConfirm: (groups: GroupRepresentation[]) => void;
  onClose: () => void;
};

type SelectableGroup = GroupRepresentation & {
  checked?: boolean;
};

export const GroupPickerDialog = ({
  id,
  type,
  filterGroups,
  text,
  onClose,
  onConfirm,
}: GroupPickerDialogProps) => {
  const { t } = useTranslation();
  const adminClient = useAdminClient();
  const [selectedRows, setSelectedRows] = useState<SelectableGroup[]>([]);

  const [navigation, setNavigation] = useState<SelectableGroup[]>([]);
  const [groups, setGroups] = useState<SelectableGroup[]>([]);
  const [filtered, setFiltered] = useState<GroupRepresentation[]>();
  const [filter, setFilter] = useState("");
  const [joinedGroups, setJoinedGroups] = useState<GroupRepresentation[]>([]);

  const [groupId, setGroupId] = useState<string>();
  const currentGroup = () => navigation[navigation.length - 1];

  useFetch(
    async () => {
      const allGroups = await adminClient.groups.find();

      if (groupId) {
        const group = await adminClient.groups.findOne({ id: groupId });
        return { group, groups: group.subGroups! };
      } else if (id) {
        const existingUserGroups = await adminClient.users.listGroups({
          id,
        });
        return {
          groups: allGroups,
          existingUserGroups,
        };
      } else
        return {
          groups: allGroups,
        };
    },
    async ({ group: selectedGroup, groups, existingUserGroups }) => {
      setJoinedGroups(existingUserGroups || []);
      if (selectedGroup) {
        setNavigation([...navigation, selectedGroup]);
      }

      groups.forEach((group: SelectableGroup) => {
        group.checked = !!selectedRows.find((r) => r.id === group.id);
      });
      setGroups(
        filterGroups
          ? [
              ...groups.filter(
                (row) => filterGroups && !filterGroups.includes(row.name!)
              ),
            ]
          : groups
      );
    },
    [groupId]
  );

  const isRowDisabled = (row?: GroupRepresentation) => {
    return !!joinedGroups.find((group) => group.id === row?.id);
  };

  const hasSubgroups = (group: GroupRepresentation) => {
    return group.subGroups!.length !== 0;
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={t(text.title, {
        group1: filter[0],
        group2: currentGroup() ? currentGroup().name : t("root"),
      })}
      isOpen
      onClose={onClose}
      actions={[
        <Button
          data-testid={`${text.ok}-button`}
          key="confirm"
          variant="primary"
          form="group-form"
          onClick={() => {
            onConfirm(type === "selectMany" ? selectedRows : [currentGroup()]);
          }}
          isDisabled={type === "selectMany" && selectedRows.length === 0}
        >
          {t(text.ok)}
        </Button>,
      ]}
    >
      <Breadcrumb>
        <BreadcrumbItem key="home">
          <Button
            variant="link"
            onClick={() => {
              setGroupId(undefined);
              setNavigation([]);
            }}
          >
            {t("groups")}
          </Button>
        </BreadcrumbItem>
        {navigation.map((group, i) => (
          <BreadcrumbItem key={i}>
            {navigation.length - 1 !== i && (
              <Button
                variant="link"
                onClick={() => {
                  setGroupId(group.id);
                  setNavigation([...navigation].slice(0, i));
                }}
              >
                {group.name}
              </Button>
            )}
            {navigation.length - 1 === i && <>{group.name}</>}
          </BreadcrumbItem>
        ))}
      </Breadcrumb>

      <Toolbar>
        <ToolbarContent>
          <ToolbarItem>
            <InputGroup>
              <TextInput
                type="search"
                aria-label={t("common:search")}
                placeholder={t("users:searchForGroups")}
                onChange={(value) => {
                  if (value === "") {
                    setFiltered(undefined);
                  }
                  setFilter(value);
                }}
              />
              <Button
                variant={ButtonVariant.control}
                aria-label={t("common:search")}
                onClick={() =>
                  setFiltered(
                    groups.filter((group) =>
                      group.name?.toLowerCase().includes(filter.toLowerCase())
                    )
                  )
                }
              >
                <SearchIcon />
              </Button>
            </InputGroup>
          </ToolbarItem>
        </ToolbarContent>
      </Toolbar>
      <DataList aria-label={t("groups")} isCompact>
        {(filtered || groups).map((group: SelectableGroup) => (
          <DataListItem
            aria-labelledby={group.name}
            key={group.id}
            id={group.id}
            onClick={(e) => {
              if (type === "selectOne") {
                setGroupId(group.id);
              } else if (
                hasSubgroups(group) &&
                (e.target as HTMLInputElement).type !== "checkbox"
              ) {
                setGroupId(group.id);
              }
            }}
          >
            <DataListItemRow
              className={`join-group-dialog-row-${
                isRowDisabled(group) ? "m-disabled" : ""
              }`}
              data-testid={group.name}
            >
              {type === "selectMany" && (
                <DataListCheck
                  className="join-group-modal-check"
                  data-testid={`${group.name}-check`}
                  checked={group.checked}
                  isDisabled={isRowDisabled(group)}
                  onChange={(checked) => {
                    group.checked = checked;
                    let newSelectedRows: SelectableGroup[] = [];
                    if (!group.checked) {
                      newSelectedRows = selectedRows.filter(
                        (r) => r.id !== group.id
                      );
                    } else if (group.checked) {
                      newSelectedRows = [...selectedRows, group];
                    }

                    setSelectedRows(newSelectedRows);
                  }}
                  aria-labelledby="data-list-check"
                />
              )}

              <DataListItemCells
                dataListCells={[
                  <DataListCell key={`name-${group.id}`}>
                    <>{group.name}</>
                  </DataListCell>,
                ]}
              />
              <DataListAction
                aria-labelledby={`select-${group.name}`}
                id={`select-${group.name}`}
                aria-label={t("groupName")}
                isPlainButtonAction
              >
                {(hasSubgroups(group) || type === "selectOne") && (
                  <Button isDisabled variant="link">
                    <AngleRightIcon />
                  </Button>
                )}
              </DataListAction>
            </DataListItemRow>
          </DataListItem>
        ))}
        {(filtered || groups).length === 0 && filter === "" && (
          <ListEmptyState
            hasIcon={false}
            message={t("groups:moveGroupEmpty")}
            instructions={t("groups:moveGroupEmptyInstructions")}
          />
        )}
      </DataList>
    </Modal>
  );
};
