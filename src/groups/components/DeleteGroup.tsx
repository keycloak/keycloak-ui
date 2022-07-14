import React from "react";
import { useTranslation } from "react-i18next";
import { ButtonVariant } from "@patternfly/react-core";

import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import {
  ConfirmDialogModal,
  ConfirmDialogProps,
} from "../../components/confirm-dialog/ConfirmDialog";
import { useAdminClient } from "../../context/auth/AdminClient";
import { useAlerts } from "../../components/alert/Alerts";

type DeleteConfirmProps = {
  selectedRows: GroupRepresentation[];
  show: boolean;
  toggleDialog: () => void;
  refresh?: () => void;
};

export const DeleteGroup = ({
  selectedRows,
  show,
  toggleDialog,
  refresh,
}: DeleteConfirmProps) => {
  const { t } = useTranslation("groups");
  const adminClient = useAdminClient();
  const { addAlert, addError } = useAlerts();

  const multiDelete = async () => {
    try {
      for (const group of selectedRows) {
        await adminClient.groups.del({
          id: group.id!,
        });
      }
      addAlert(t("groupDeleted", { count: selectedRows.length }));
    } catch (error) {
      addError("groups:groupDeleteError", error);
    }
    if (refresh) refresh();
  };

  const modalProps: ConfirmDialogProps = {
    titleKey: t("deleteConfirmTitle", { count: selectedRows.length }),
    messageKey: t("deleteConfirm", { count: selectedRows.length }),
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: multiDelete,
  };

  return (
    <ConfirmDialogModal
      key="confirmDialog"
      {...modalProps}
      open={show}
      toggleDialog={toggleDialog}
    />
  );
};
