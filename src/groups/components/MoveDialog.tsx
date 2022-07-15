import React from "react";
import { useTranslation } from "react-i18next";

import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { useAlerts } from "../../components/alert/Alerts";
import { GroupPickerDialog } from "../../components/group/GroupPickerDialog";
import { useAdminClient } from "../../context/auth/AdminClient";

type MoveDialogProps = {
  source: GroupRepresentation;
  onClose: () => void;
  refresh: () => void;
};

export const MoveDialog = ({ source, onClose, refresh }: MoveDialogProps) => {
  const { t } = useTranslation("groups");

  const { adminClient } = useAdminClient();
  const { addAlert, addError } = useAlerts();

  const moveGroup = async (group?: GroupRepresentation[]) => {
    try {
      if (group !== undefined) {
        try {
          await adminClient.groups.setOrCreateChild(
            { id: group[0].id! },
            source
          );
        } catch (error: any) {
          if (error.response) {
            throw error;
          }
        }
      } else {
        await adminClient.groups.del({ id: source.id! });
        const { id } = await adminClient.groups.create({
          ...source,
          id: undefined,
        });
        if (source.subGroups) {
          await Promise.all(
            source.subGroups.map((s) =>
              adminClient.groups.setOrCreateChild(
                { id: id! },
                {
                  ...s,
                  id: undefined,
                }
              )
            )
          );
        }
      }
      refresh();
      addAlert(t("moveGroupSuccess"));
    } catch (error) {
      addError("groups:moveGroupError", error);
    }
  };

  return (
    <GroupPickerDialog
      type="selectOne"
      filterGroups={[source.name!]}
      text={{
        title: "groups:moveToGroup",
        ok: "groups:moveHere",
      }}
      onClose={onClose}
      onConfirm={moveGroup}
    />
  );
};
