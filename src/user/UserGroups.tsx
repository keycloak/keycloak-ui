import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
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

type UserGroupsTabProps = {
  onRemove?: (newReps: GroupRepresentation[]) => void;
  userID?: string;
};

export const UserGroups = ({ onRemove, userID }: UserGroupsTabProps) => {
  const { t } = useTranslation("roles");
  const history = useHistory();
  const { addAlert } = useAlerts();
  const { url } = useRouteMatch();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  const [selectedRows, setSelectedRows] = useState<RoleRepresentation[]>([]);
  const [isDirectMembership, setDirectMembership] = useState(false);
  const [userId, setUserId] = useState("");
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

  const toggleModal = () => setOpen(!open);

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "roles:roleRemoveAssociatedRoleConfirm",
    messageKey: t("roles:roleRemoveAssociatedText"),
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.roles.delCompositeRoles({ id }, selectedRows);
        setSelectedRows([]);

        addAlert(t("associatedRolesRemoved"), AlertVariant.success);
      } catch (error) {
        addAlert(t("roleDeleteError", { error }), AlertVariant.danger);
      }
    },
  });

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
              title: t("common:remove"),
              onRowClick: () => {
                toggleDeleteDialog();
              },
            },
          ]}
          columns={[
            {
              name: "groupMembership",
              displayKey: "users:groupMembership",
              cellRenderer: AliasRenderer,
              cellFormatters: [emptyFormatter()],
            },
            {
              name: "path",
              displayKey: "users:Path",
              cellFormatters: [emptyFormatter()],
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
