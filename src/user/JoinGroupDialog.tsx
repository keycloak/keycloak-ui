import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
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
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { asyncStateFetch, useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { AngleRightIcon, SearchIcon } from "@patternfly/react-icons";
import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";
import { useErrorHandler } from "react-error-boundary";
import { useParams } from "react-router-dom";
// import { AliasRendererComponent } from "./AliasRendererComponent";

export type JoinGroupDialogProps = {
  open: boolean;
    group: GroupRepresentation;
//   toggleDialog: () => void;
  onClose: () => void;
//   username: string;
  onConfirm: (newReps: GroupRepresentation[]) => void;
};

export const JoinGroupDialog = ({
  group,
  onClose,
  onMove,
  open,
  toggleDialog,
  onConfirm,
}: JoinGroupDialogProps) => {
  const { t } = useTranslation("roles");
  const form = useForm<RoleRepresentation>({ mode: "onChange" });
  const [name, setName] = useState("");
  const adminClient = useAdminClient();
  const [selectedRows, setSelectedRows] = useState<GroupRepresentation[]>([]);
  //   const [id, setId] = useState<string>();

  const errorHandler = useErrorHandler();

  const [navigation, setNavigation] = useState<GroupRepresentation[]>([]);
  const [groups, setGroups] = useState<GroupRepresentation[]>([]);
  const [filtered, setFiltered] = useState<GroupRepresentation[]>();
  const [filter, setFilter] = useState("");

  const [groupId, setGroupId] = useState<string>();

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState("roles");
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

    const { id } = useParams<{ id: string }>();

  console.log;

  useEffect(() => {
    refresh();
  }, [filterType]);

  const currentGroup = () => navigation[navigation.length - 1];
  console.log(currentGroup);
  console.log("navigation" , navigation);
  useEffect(
    () =>
      asyncStateFetch(
        async () => {
          if (groupId) {
            const group = await adminClient.groups.findOne({ id: groupId });
            return { group, groups: group.subGroups! };
          } else {
            return { group, groups: await adminClient.groups.find() };
          }
        },
        ({ group: selectedGroup, groups }) => {
          console.log(selectedGroup);
          console.log(groups);

          if (selectedGroup) {
            console.log("beep")
            setNavigation([...navigation, selectedGroup]);
          }
          //   setGroups(groups.filter((g) => g.id !== group.id));
          if (selectedGroup && selectedGroup.subGroups?.length !== 0) setGroups(groups);
        },
        errorHandler
      ),
    [groupId]
  );

  console.log(selectedRows)


  return (
    <Modal
      variant={ModalVariant.small}
      //   title={
      //     currentGroup()
      //       ? t("moveToGroup", {
      //           group1: group.name,
      //           group2: currentGroup().name,
      //         })
      //       : t("moveTo")
      //   }
      isOpen={true}
      onClose={onClose}
      actions={[
        <Button
          data-testid="moveGroup"
          key="confirm"
          variant="primary"
          form="group-form"
            onClick={async () => {
              try {
                await adminClient.users.addToGroup({
                  id,
                  groupId: navigation[navigation.length - 1].id,
                });
                refresh();
                addAlert(t("users:removedGroupMembership"), AlertVariant.success);
              } catch (error) {
                addAlert(
                  t("users:removedGroupMembershipError", { error }),
                  AlertVariant.danger
                );
              }
            }}
        >
          {t("users:Join")}
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
      <DataList
        onSelectDataListItem={(value) => setGroupId(value)}
        aria-label={t("groups")}
        isCompact

      >
        {(filtered || groups).map((group) => (
          <DataListItem
            aria-labelledby={group.name}
            key={group.id}
            id={group.id}
          >
            <DataListItemRow data-testid={group.name}>
            <DataListCheck onChange={(checked) => {
            checked ? setSelectedRows([...selectedRows, group]) : setSelectedRows([...selectedRows.filter((g) => g.id != group.id), group]);
          }} aria-labelledby="data-list-check" />

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
                <Button isDisabled variant="link">
                  <AngleRightIcon />
                </Button>
              </DataListAction>
            </DataListItemRow>
          </DataListItem>
        ))}
        {/* {(filtered || groups).length === 0 && (
          <ListEmptyState
            hasIcon={false}
            message={t("moveGroupEmpty")}
            instructions={t("moveGroupEmptyInstructions")}
          />
        )} */}
      </DataList>
    </Modal>
  );
};
