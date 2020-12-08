import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Dropdown,
  DropdownItem,
  KebabToggle,
  PageSection,
  PageSectionVariants,
  ToolbarItem,
  AlertVariant,
} from "@patternfly/react-core";
import { UsersIcon } from "@patternfly/react-icons";
import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";

import { GroupsCreateModal } from "./GroupsCreateModal";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { useAdminClient } from "../context/auth/AdminClient";
import { useAlerts } from "../components/alert/Alerts";
import { DataList } from "../components/table-toolbar/DataList";

import "./GroupsSection.css";
import { Link } from "react-router-dom";

type GroupTableData = GroupRepresentation & {
  membersLength?: number;
};

export const GroupsSection = () => {
  const { t } = useTranslation("groups");
  const adminClient = useAdminClient();
  const [isKebabOpen, setIsKebabOpen] = useState(false);
  const [createGroupName, setCreateGroupName] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<
    GroupRepresentation[] | undefined
  >([]);
  const { addAlert } = useAlerts();

  const getMembers = async (id: string) => {
    const response = await adminClient.groups.listMembers({ id });
    return response ? response.length : 0;
  };

  const loader = async () => {
    const groupsData = await adminClient.groups.find();

    const memberPromises = groupsData.map((group) => getMembers(group.id!));
    const memberData = await Promise.all(memberPromises);
    const updatedObject = groupsData.map((group: GroupTableData, i) => {
      group.membersLength = memberData[i];
      return group;
    });
    return updatedObject;
  };

  const handleModalToggle = () => {
    setIsCreateModalOpen(!isCreateModalOpen);
  };

  const deleteGroup = (group: GroupRepresentation) => {
    try {
      return adminClient.groups.del({
        id: group.id!,
      });
    } catch (error) {
      addAlert(t("groupDeleteError", { error }), AlertVariant.danger);
    }
  };

  const multiDelete = async () => {
    if (selectedRows!.length !== 0) {
      const chainedPromises = selectedRows!.map((group) => deleteGroup(group));

      await Promise.all(chainedPromises);
      addAlert(t("groupsDeleted"), AlertVariant.success);
      setSelectedRows(undefined);
    }
  };

  const GroupNameCell = (group: GroupTableData) => (
    <>
      <Link key={group.id} to={`/groups/${group.id}`}>
        {group.name}
      </Link>
    </>
  );

  const GroupMemberCell = (group: GroupTableData) => (
    <div className="keycloak-admin--groups__member-count">
      <UsersIcon key={`user-icon-${group.id}`} />
      {group.membersLength}
    </div>
  );

  return (
    <>
      <ViewHeader titleKey="groups:groups" subKey="groups:groupsDescription" />
      <PageSection variant={PageSectionVariants.light}>
        <DataList
          key={`data-list-${isCreateModalOpen}${selectedRows === undefined}`}
          onSelect={(rows) => setSelectedRows([...rows])}
          canSelectAll={false}
          loader={loader}
          ariaLabelKey="client-scopes:clientScopeList"
          searchPlaceholderKey="client-scopes:searchFor"
          toolbarItem={
            <>
              <ToolbarItem>
                <Button variant="primary" onClick={handleModalToggle}>
                  {t("createGroup")}
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Dropdown
                  toggle={
                    <KebabToggle
                      onToggle={() => setIsKebabOpen(!isKebabOpen)}
                    />
                  }
                  isOpen={isKebabOpen}
                  isPlain
                  dropdownItems={[
                    <DropdownItem
                      key="action"
                      component="button"
                      onClick={() => {
                        multiDelete();
                        setIsKebabOpen(false);
                      }}
                    >
                      {t("common:delete")}
                    </DropdownItem>,
                  ]}
                />
              </ToolbarItem>
            </>
          }
          actions={[
            {
              title: t("moveTo"),
              onRowClick: () => console.log("TO DO: Add move to functionality"),
            },
            {
              title: t("common:delete"),
              onRowClick: async (group: GroupRepresentation) => {
                deleteGroup(group);
                return true;
              },
            },
          ]}
          columns={[
            {
              name: "name",
              displayKey: "groups:groupName",
              cellRenderer: GroupNameCell,
            },
            {
              name: "members",
              displayKey: "groups:members",
              cellRenderer: GroupMemberCell,
            },
          ]}
          emptyState={
            <ListEmptyState
              hasIcon={true}
              message={t("noGroupsInThisRealm")}
              instructions={t("noGroupsInThisRealmInstructions")}
              primaryActionText={t("createGroup")}
              onPrimaryAction={() => handleModalToggle()}
            />
          }
        />

        <GroupsCreateModal
          isCreateModalOpen={isCreateModalOpen}
          handleModalToggle={handleModalToggle}
          setIsCreateModalOpen={setIsCreateModalOpen}
          createGroupName={createGroupName}
          setCreateGroupName={setCreateGroupName}
        />
      </PageSection>
    </>
  );
};
