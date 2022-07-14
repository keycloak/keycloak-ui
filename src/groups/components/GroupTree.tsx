import React, { useState } from "react";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { Button, TreeViewDataItem } from "@patternfly/react-core";
import { TrashIcon } from "@patternfly/react-icons";

import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { useAdminClient, useFetch } from "../../context/auth/AdminClient";
import { KeycloakSpinner } from "../../components/keycloak-spinner/KeycloakSpinner";
import { CheckableTreeView } from "./CheckableTreeView";

const mapGroup = (
  { id, name, subGroups }: GroupRepresentation,
  t: TFunction
): TreeViewDataItem => {
  return {
    id,
    name,
    checkProps: { checked: false },
    children:
      subGroups && subGroups.length > 0
        ? subGroups.map((g) => mapGroup(g, t))
        : undefined,
    action: (
      <Button variant="plain" aria-label={t("common:delete")}>
        <TrashIcon />
      </Button>
    ),
  };
};

export const GroupTree = () => {
  const { t } = useTranslation("groups");

  const adminClient = useAdminClient();
  const [data, setData] = useState<TreeViewDataItem[]>();

  useFetch(
    () =>
      adminClient.groups.find({
        briefRepresentation: false,
      }),
    (groups) => setData(groups.map((g) => mapGroup(g, t))),
    []
  );

  return data ? <CheckableTreeView data={data} /> : <KeycloakSpinner />;
};
