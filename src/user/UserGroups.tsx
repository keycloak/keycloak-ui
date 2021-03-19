import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  PageSection,
} from "@patternfly/react-core";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAlerts } from "../components/alert/Alerts";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { emptyFormatter } from "../util";
import { useAdminClient } from "../context/auth/AdminClient";
import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";
import { cellWidth } from "@patternfly/react-table";

type UserGroupsProps = {
  username?: string;
};

export const UserGroups = ({ username }: UserGroupsProps) => {
  const { t } = useTranslation("roles");
  const { addAlert } = useAlerts();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  const [selectedGroup, setSelectedGroup] = useState<GroupRepresentation>();

  const [isDirectMembership, setDirectMembership] = useState(false);
  const [open, setOpen] = useState(false);

  const adminClient = useAdminClient();
  const { id } = useParams<{ id: string }>();
  const loader = async () => {
    const allGroups = await adminClient.users.listGroups({ id });

    return allGroups;
  };

  useEffect(() => {
    refresh();
  }, [isDirectMembership]);

  const AliasRenderer = (group: GroupRepresentation) => {
    return <>{group.name}</>;
  };

  const LeaveButtonRenderer = (group: GroupRepresentation) => {
    return (
      <>
        <Button onClick={() => leave(group)} variant="link">
          {t("users:Leave")}
        </Button>
      </>
    );
  };

  const toggleModal = () => setOpen(!open);

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("users:leaveGroup", {
      name: selectedGroup?.name,
    }),
    messageKey: t("users:leaveGroupConfirmDialog", {
      groupname: selectedGroup?.name,
      username: username,
    }),
    continueButtonLabel: "users:leave",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.users.delFromGroup({
          id,
          groupId: selectedGroup!.id!,
        });
        refresh();
        addAlert(t("users:removedGroupMembership"), AlertVariant.success);
      } catch (error) {
        addAlert(
          t("users:removedGroupMembershipError", { error }),
          AlertVariant.danger
        );
      }
    },
  });

  const leave = (group: GroupRepresentation) => {
    setSelectedGroup(group);
    toggleDeleteDialog();
  };

  return (
    <>
      <PageSection variant="light">
        <DeleteConfirm />
        <KeycloakDataTable
          key={key}
          loader={loader}
          isPaginated
          ariaLabelKey="roles:roleList"
          searchPlaceholderKey="groups:searchGroup"
          canSelectAll
          onSelect={() => {}}
          toolbarItem={
            <>
              <Checkbox
                label={t("users:directMembership")}
                key="direct-membership-check"
                id="kc-direct-membership-checkbox"
                onChange={() => setDirectMembership(!isDirectMembership)}
                isChecked={isDirectMembership}
              />
              <Button
                className="kc-add-role-button"
                key="add-role-button"
                onClick={() => toggleModal()}
                data-testid="add-role-button"
              >
                {t("addRole")}
              </Button>
            </>
          }
          actions={[
            {
              title: "Functionality here TBD",
              onRowClick: () => {},
            },
          ]}
          columns={[
            {
              name: "groupMembership",
              displayKey: "users:groupMembership",
              cellRenderer: AliasRenderer,
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(40)],
            },
            {
              name: "path",
              displayKey: "users:Path",
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(45)],
            },
            {
              name: "",
              cellRenderer: LeaveButtonRenderer,
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(20)],
            },
          ]}
          emptyState={
            <ListEmptyState
              hasIcon={true}
              message={t("users:noGroups")}
              instructions={t("users:noGroupsText")}
              primaryActionText={t("users:joinGroup")}
              onPrimaryAction={() => {}}
            />
          }
        />
      </PageSection>
    </>
  );
};
