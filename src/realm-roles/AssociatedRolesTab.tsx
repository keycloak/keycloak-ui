import React, { useState } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  PageSection,
} from "@patternfly/react-core";
import { IFormatter, IFormatterValueType } from "@patternfly/react-table";

import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { formattedLinkTableCell } from "../components/external-link/FormattedLink";
import { useAlerts } from "../components/alert/Alerts";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { emptyFormatter, toUpperCase } from "../util";
import { AssociatedRolesModal } from "./AssociatedRolesModal";

type AssociatedRolesTabProps = {
  additionalRoles: RoleRepresentation[];
  // addComposites: (composites: Composites[]) => Promise<void>;
  addComposites: (newReps: RoleRepresentation[]) => void;
};

export const AssociatedRolesTab = ({
  additionalRoles,
  addComposites,
}: AssociatedRolesTabProps) => {
  const { t } = useTranslation("roles");
  const history = useHistory();
  const { addAlert } = useAlerts();
  const { url } = useRouteMatch();
  const tableRefresher = React.useRef<() => void>();

  const [selectedRole, setSelectedRole] = useState<RoleRepresentation>();
  const [open, setOpen] = useState(false);

  const loader = async () => {
    return Promise.resolve(additionalRoles);
  };

  React.useEffect(() => {
    tableRefresher.current && tableRefresher.current();
  }, [additionalRoles]);

  const RoleDetailLink = (role: RoleRepresentation) => (
    <>
      <Link key={role.id} to={`${url}/${role.id}`}>
        {role.name}
      </Link>
    </>
  );

  const boolFormatter = (): IFormatter => (data?: IFormatterValueType) => {
    const boolVal = data?.toString();

    return (boolVal ? toUpperCase(boolVal) : undefined) as string;
  };

  const toggleModal = () => setOpen(!open);

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "roles:roleRemoveAssociatedRoleConfirm",
    messageKey: t("roles:roleRemoveAssociatedText", {
      selectedRoleName: selectedRole ? selectedRole!.name : "",
    }),
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        // await adminClient.roles.delCompositeRoles({ id: compID }, compies);

        setSelectedRole(undefined);
        addAlert(t("roleDeletedSuccess"), AlertVariant.success);
      } catch (error) {
        addAlert(`${t("roleDeleteError")} ${error}`, AlertVariant.danger);
      }
    },
  });

  const setRefresher = (refresher: () => void) => {
    tableRefresher.current = refresher;
  };

  const goToCreate = () => history.push(`${url}/add-role`);
  return (
    <>
      <PageSection variant="light">
        <DeleteConfirm />
        <AssociatedRolesModal
          onConfirm={addComposites}
          existingCompositeRoles={additionalRoles}
          open={open}
          toggleDialog={() => setOpen(!open)}
        />
        <KeycloakDataTable
          key={selectedRole ? selectedRole.id : "roleList"}
          loader={loader}
          ariaLabelKey="roles:roleList"
          searchPlaceholderKey="roles:searchFor"
          isPaginated
          setRefresher={setRefresher}
          toolbarItem={
            <>
              <Checkbox
                label="Hide inherited roles"
                key="associated-roles-check"
                id="kc-hide-inherited-roles-checkbox"
              />
              <Button className="kc-add-role-button" key="add-role-button" onClick={() => toggleModal()}>
                {t("addRole")}
              </Button>
              <Button variant="link" key="remove-role-button" onClick={() => toggleModal()}>
                {t("removeRole")}
              </Button>
            </>
          }
          actions={[
            {
              title: t("common:remove"),
              onRowClick: (role) => {
                setSelectedRole(role);
                toggleDeleteDialog();
              },
            },
          ]}
          columns={[
            {
              name: "name",
              displayKey: "roles:roleName",
              cellRenderer: RoleDetailLink,
              cellFormatters: [formattedLinkTableCell(), emptyFormatter()],
            },
            {
              name: "composite",
              displayKey: "roles:composite",
              cellFormatters: [boolFormatter(), emptyFormatter()],
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
