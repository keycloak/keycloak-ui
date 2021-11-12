import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Tab, Tabs, TabTitleText } from "@patternfly/react-core";

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";
import { AssociatedRolesTab } from "../realm-roles/AssociatedRolesTab";
import { KeycloakSpinner } from "../components/keycloak-spinner/KeycloakSpinner";

type Realm = RealmRepresentation & {
  defaultRole: {
    id: string;
    name: string;
  };
};

export const UserRegistration = () => {
  const { t } = useTranslation("realm-settings");
  const [realm, setRealm] = useState<RealmRepresentation>();
  const [activeTab, setActiveTab] = useState(10);
  const [key, setKey] = useState(0);

  const adminClient = useAdminClient();
  const { realm: realmName } = useRealm();

  useFetch(
    () => adminClient.realms.findOne({ realm: realmName }),
    setRealm,
    []
  );

  if (!realm) {
    return <KeycloakSpinner />;
  }

  return (
    <Tabs
      key={key}
      activeKey={activeTab}
      onSelect={(_, key) => setActiveTab(key as number)}
    >
      <Tab
        id="roles"
        eventKey={10}
        title={<TabTitleText>{t("defaultRoles")}</TabTitleText>}
      >
        <AssociatedRolesTab
          parentRole={(realm as Realm).defaultRole}
          refresh={() => setKey(key + 1)}
        />
      </Tab>
      <Tab
        id="groups"
        eventKey={20}
        title={<TabTitleText>{t("defaultGroups")}</TabTitleText>}
      >
        <h1>Work in progress</h1>
      </Tab>
    </Tabs>
  );
};
