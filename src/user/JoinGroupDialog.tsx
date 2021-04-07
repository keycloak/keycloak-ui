import React, { useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
import {
  AlertVariant,
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
import { asyncStateFetch, useAdminClient } from "../context/auth/AdminClient";
import { AngleRightIcon, SearchIcon } from "@patternfly/react-icons";
import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";
import { useErrorHandler } from "react-error-boundary";
import { useParams } from "react-router-dom";
import { useAlerts } from "../components/alert/Alerts";

export type JoinGroupDialogProps = {
  open: boolean;
  group: GroupRepresentation;
  toggleDialog: () => void;
  onClose: () => void;
  onConfirm: () => void;
};

export const JoinGroupDialog = ({
  group,
  onClose,
  open,
  toggleDialog,
}: JoinGroupDialogProps) => {
  const { t } = useTranslation("roles");
  const adminClient = useAdminClient();

  const errorHandler = useErrorHandler();

  const [navigation, setNavigation] = useState<GroupRepresentation[]>([]);
  const [groups, setGroups] = useState<GroupRepresentation[]>([]);
  const [filtered, setFiltered] = useState<GroupRepresentation[]>();
  const [filter, setFilter] = useState("");

  const [groupId, setGroupId] = useState<string>();
  const { addAlert } = useAlerts();

  const { id } = useParams<{ id: string }>();

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
        async ({ group: selectedGroup, groups }) => {
          if (selectedGroup) {
            setNavigation([...navigation, selectedGroup]);
          }

          setGroups(groups);
        },
        errorHandler
      ),
    [groupId]
  );

  return (
    <Modal
      variant={ModalVariant.small}
      isOpen={open}
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
                id: id,
                groupId: navigation[navigation.length - 1].id!,
              });
              toggleDialog();
              addAlert(t("users:addedGroupMembership"), AlertVariant.success);
            } catch (error) {
              addAlert(
                t("users:addedGroupMembershipError", { error }),
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
      </DataList>
    </Modal>
  );
};
