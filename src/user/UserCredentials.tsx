import React, { useState } from "react";
import { AlertVariant } from "@patternfly/react-core";
import { cellWidth } from "@patternfly/react-table";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { useTranslation } from "react-i18next";
import { useAlerts } from "../components/alert/Alerts";
import { PasswordPickerDialog } from "../components/password-picker/PasswordPickerDialog";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAdminClient } from "../context/auth/AdminClient";
import { emptyFormatter } from "../util";

type UserCredentialsProps = {
  user: UserRepresentation;
};

export const UserCredentials = ({ user }: UserCredentialsProps) => {
  const { t } = useTranslation("users");
  const { addAlert, addError } = useAlerts();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());
  const [open, setOpen] = useState(false);
  const adminClient = useAdminClient();

  const toggleModal = () => {
    setOpen(!open);
  };

  const saveUserPassword = async (id: string) => {
    try {
      await adminClient.users.resetPassword({
        id,
        credential: {
          temporary: true,
          type: "",
          value: "",
        },
      });
      refresh();
      addAlert(t("savePasswordSuccess"), AlertVariant.success);
    } catch (error) {
      addError("users:savePasswordError", error);
    }
  };

  const loader = async () =>
    await adminClient.users.getCredentials({ id: user.id! });

  return (
    <>
      {open && (
        <PasswordPickerDialog
          text={{
            title: `${t("setPasswordFor")} ${user.username}`,
            ok: "users:save",
            cancel: "users:cancel",
          }}
          onClose={() => setOpen(false)}
          onConfirm={() => {
            saveUserPassword(user.id!);
            setOpen(false);
            refresh();
          }}
          onCancel={() => setOpen(false)}
        />
      )}
      <KeycloakDataTable
        key={key}
        loader={loader}
        ariaLabelKey="users:credentialsList"
        columns={[
          {
            name: "type",
            displayKey: "users:credentialType",
            cellFormatters: [emptyFormatter()],
            transforms: [cellWidth(40)],
          },
          {
            name: "user label",
            displayKey: "users:credentialUserLabel",
            transforms: [cellWidth(45)],
          },

          {
            name: "data",
            displayKey: "users:credentialData",
            cellFormatters: [emptyFormatter()],
            transforms: [cellWidth(20)],
          },
        ]}
        emptyState={
          <ListEmptyState
            hasIcon={true}
            message={t("noCredentials")}
            instructions={t("noCredentialsText")}
            primaryActionText={t("setPassword")}
            onPrimaryAction={toggleModal}
          />
        }
      />
    </>
  );
};
