import React, { useState } from "react";
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
import { formattedLinkTableCell } from "../components/external-link/FormattedLink";
import { useAlerts } from "../components/alert/Alerts";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { emptyFormatter } from "../util";
import { AssociatedRolesModal } from "./AssociatedRolesModal";
import { useAdminClient } from "../context/auth/AdminClient";
import { RoleFormType } from "./RealmRoleTabs";
import ClientRepresentation from "keycloak-admin/lib/defs/clientRepresentation";

type AssociatedRolesTabProps = {
  additionalRoles: RoleRepresentation[];
  addComposites: (newReps: RoleRepresentation[]) => void;
  parentRole: RoleFormType;
  onRemove: (newReps: RoleRepresentation[]) => void;
  client?: ClientRepresentation;
};

export const AssociatedRolesTab = ({
  additionalRoles,
  addComposites,
  parentRole,
  onRemove,
  client,
}: AssociatedRolesTabProps) => {
  const { t } = useTranslation("roles");
  const history = useHistory();
  const { addAlert } = useAlerts();
  const { url } = useRouteMatch();
  const tableRefresher = React.useRef<() => void>();

  const [selectedRows, setSelectedRows] = useState<RoleRepresentation[]>([]);
  const [open, setOpen] = useState(false);

  const adminClient = useAdminClient();
  const { id, clientId } = useParams<{ id: string; clientId: string }>();
  const inheritanceMap = React.useRef<{ [key: string]: string }>({});

  const getSubRoles = async (
    role: RoleRepresentation,
    allRoles: RoleRepresentation[]
  ): Promise<RoleRepresentation[]> => {
    // Fetch all composite roles
    const allCompositeRoles = await await adminClient.roles.getCompositeRoles({
      id: role.id!,
    });

    // Need to ensure we don't get into an infinite loop, do not add any role that is already there or the starting role
    const newRoles: RoleRepresentation[] = await allCompositeRoles.reduce(
      async (acc: RoleRepresentation[], newRole) => {
        const resolvedRoles = await acc;
        if (!allRoles.find((ar) => ar.id === newRole.id)) {
          if (newRole.name === "manage-realm") {
            console.log(`-------- Parent Role --------`);
            console.dir(role);
          }
          inheritanceMap.current[newRole.id] = role.name;
          console.log(inheritanceMap);
          resolvedRoles.push(newRole);
          const subRoles = await getSubRoles(newRole, [
            ...allRoles,
            ...resolvedRoles,
          ]);
          resolvedRoles.push(...subRoles);
        }

        return acc;
      },
      [] as RoleRepresentation[]
    );

    return Promise.resolve(newRoles);
  };

  const loader = async () => {
    const allRoles: RoleRepresentation[] = await additionalRoles.reduce(
      async (acc: RoleRepresentation[], role) => {
        const resolvedRoles = await acc;
        resolvedRoles.push(role);
        const subRoles = await getSubRoles(role, resolvedRoles);
        resolvedRoles.push(...subRoles);

        return acc;
      },
      [] as RoleRepresentation[]
    );

    return Promise.resolve(allRoles);
  };

  // console.log(loader())

  React.useEffect(() => {
    tableRefresher.current && tableRefresher.current();
  }, [additionalRoles]);

  const RoleName = (role: RoleRepresentation) => <>{role.name}</>;

  const InheritedRoleName = (role: RoleRepresentation) => {
    if (role.name === "manage-realm") {
      console.log(`----- ROLE: ${role.containerId}`);
      console.dir(role);
    }
    if (role.id === "4e3f5bbd-fa32-467e-a8ca-88f141317dc9") {
      console.log(`----- PARENT ROLE: ${role.containerId}`);
      console.dir(role);
    }
    return <>{inheritanceMap.current[role.id]}</>;
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

  const [
    toggleDeleteAssociatedRolesDialog,
    DeleteAssociatedRolesConfirm,
  ] = useConfirmDialog({
    titleKey: t("roles:removeAssociatedRoles") + "?",
    messageKey: t("roles:removeAllAssociatedRolesConfirmDialog", {
      name: parentRole?.name || t("createRole"),
    }),
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        if (selectedRows.length === additionalRoles.length) {
          onRemove(selectedRows);
          const loc = url.replace(/\/AssociatedRoles/g, "/details");
          history.push(loc);
        }
        onRemove(selectedRows);
        await adminClient.roles.delCompositeRoles({ id }, selectedRows);
        addAlert(t("associatedRolesRemoved"), AlertVariant.success);
      } catch (error) {
        addAlert(`${t("roleDeleteError")} ${error}`, AlertVariant.danger);
      }
    },
  });

  const setRefresher = (refresher: () => void) => {
    tableRefresher.current = refresher;
  };

  // const beep = additionalRoles[0].containerId;

  const goToCreate = () => history.push(`${url}/add-role`);
  return (
    <>
      <PageSection variant="light">
        <DeleteConfirm />
        <DeleteAssociatedRolesConfirm />
        <AssociatedRolesModal
          onConfirm={addComposites}
          existingCompositeRoles={additionalRoles}
          open={open}
          toggleDialog={() => setOpen(!open)}
        />
        <KeycloakDataTable
          loader={loader}
          ariaLabelKey="roles:roleList"
          searchPlaceholderKey="roles:searchFor"
          canSelectAll
          onSelect={(rows) => {
            setSelectedRows([...rows]);
          }}
          isPaginated
          setRefresher={setRefresher}
          toolbarItem={
            <>
              <Checkbox
                label="Hide inherited roles"
                key="associated-roles-check"
                id="kc-hide-inherited-roles-checkbox"
              />
              <Button
                className="kc-add-role-button"
                key="add-role-button"
                onClick={() => toggleModal()}
                data-cy="add-role-button"
              >
                {t("addRole")}
              </Button>
              <Button
                variant="link"
                isDisabled={selectedRows.length == 0}
                key="remove-role-button"
                onClick={() => {
                  toggleDeleteAssociatedRolesDialog();
                }}
              >
                {t("removeRoles")}
              </Button>
            </>
          }
          actions={[
            {
              title: t("common:remove"),
              onRowClick: (role) => {
                setSelectedRows([role]);
                toggleDeleteDialog();
              },
            },
          ]}
          columns={[
            {
              name: "name",
              displayKey: "roles:roleName",
              cellRenderer: RoleName,
              cellFormatters: [formattedLinkTableCell(), emptyFormatter()],
            },
            {
              name: "containerId",
              displayKey: "roles:inheritedFrom",
              cellRenderer: InheritedRoleName,
              cellFormatters: [emptyFormatter()],
            },
            {
              name: "description",
              displayKey: "common:description",
              cellFormatters: [emptyFormatter()],
            },
          ]}
          emptyState={
            <ListEmptyState
              hasIcon={true}
              message={t("noRolesInThisRealm")}
              instructions={t("noRolesInThisRealmInstructions")}
              primaryActionText={t("createRole")}
              onPrimaryAction={goToCreate}
            />
          }
        />
      </PageSection>
    </>
  );
};
