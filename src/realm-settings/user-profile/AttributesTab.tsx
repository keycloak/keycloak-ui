import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertVariant } from "@patternfly/react-core";
import { useAlerts } from "../../components/alert/Alerts";
import { KeycloakSpinner } from "../../components/keycloak-spinner/KeycloakSpinner";
import { DraggableTable } from "../../authentication/components/DraggableTable";
import type UserProfileConfig from "@keycloak/keycloak-admin-client/lib/defs/userProfileConfig";
import type { UserProfileAttribute } from "@keycloak/keycloak-admin-client/lib/defs/userProfileConfig";
import { useAdminClient } from "../../context/auth/AdminClient";

type AttributesTabProps = {
  config?: UserProfileConfig;
};

type DataType = UserProfileConfig & UserProfileAttribute;

type Row = {
  name: string;
  displayName: string;
  attributeGroup: string;
  data: DataType;
};

export const AttributesTab = ({ config }: AttributesTabProps) => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const { addAlert, addError } = useAlerts();

  const [attributesList, setAttributesList] = useState<Row[]>();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);

  useEffect(() => setKey((value) => value + 1), [config]);

  const executeMove = async (
    attribute: UserProfileAttribute,
    times: number
  ) => {
    try {
      //TODO backend call
      console.log(attribute, times);
      refresh();

      addAlert(t("updatedUserProfileSuccess"), AlertVariant.success);
    } catch (error) {
      addError(t("updatedUserProfileError"), error);
    }
  };

  if (!config) {
    return <KeycloakSpinner />;
  }

  return (
    <DraggableTable
      keyField="name"
      onDragFinish={async (nameDragged, items) => {
        const keys = attributesList!.map((e) => e.name);
        const newIndex = items.indexOf(nameDragged);
        const oldIndex = keys.indexOf(nameDragged);
        const dragged = attributesList![oldIndex].data;
        if (!dragged.name) return;

        const times = newIndex - oldIndex;
        executeMove(dragged, times);
      }}
      columns={[
        {
          name: "name",
          displayKey: t("name"),
        },
        {
          name: "displayName",
          displayKey: t("displayName"),
        },
        {
          name: "group",
          displayKey: t("group"),
        },
      ]}
      data={config.attributes!}
    />
  );
};
