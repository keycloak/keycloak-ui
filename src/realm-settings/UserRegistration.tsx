import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Spinner, Tab, Tabs, TabTitleText } from "@patternfly/react-core";

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";
import { AssociatedRolesTab } from "../realm-roles/AssociatedRolesTab";

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

  const adminClient = useAdminClient();
  const { realm: realmName } = useRealm();

  useFetch(
    () => adminClient.realms.findOne({ realm: realmName }),
    setRealm,
    []
  );

  if (!realm) {
    return (
      <div className="pf-u-text-align-center">
        <Spinner />
      </div>
    );
  }

  return (
    <Tabs
      activeKey={activeTab}
      onSelect={(_, key) => setActiveTab(key as number)}
    >
      <Tab
        id="setup"
        eventKey={10}
        title={<TabTitleText>{t("defaultRoles")}</TabTitleText>}
      >
        <AssociatedRolesTab
          parentRole={(realm as Realm).defaultRole}
          refresh={() => {
            console.log("refresh");
          }}
        />
      </Tab>
      <Tab
        id="evaluate"
        eventKey={20}
        title={<TabTitleText>{t("defaultGroups")}</TabTitleText>}
      >
        {/* <EvaluateScopes clientId={clientId} protocol={client!.protocol!} /> */}
      </Tab>
    </Tabs>
  );
};
