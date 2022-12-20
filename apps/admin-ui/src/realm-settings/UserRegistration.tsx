import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AlertVariant, Tab, TabTitleText } from "@patternfly/react-core";

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";
import { KeycloakSpinner } from "../components/keycloak-spinner/KeycloakSpinner";
import { useAlerts } from "../components/alert/Alerts";
import { RoleMapping } from "../components/role-mapping/RoleMapping";
import { DefaultsGroupsTab } from "./DefaultGroupsTab";
import {
  routableTab,
  RoutableTabs,
} from "../components/routable-tabs/RoutableTabs";
import {
  UserRegistrationSubTab,
  toUserRegistrationTab,
} from "./routes/UserRegistrationTab";
import { useHistory } from "react-router";

export const UserRegistration = () => {
  const { t } = useTranslation("realm-settings");
  const [realm, setRealm] = useState<RealmRepresentation>();
  const [key, setKey] = useState(0);
  const history = useHistory();

  const { adminClient } = useAdminClient();
  const { addAlert, addError } = useAlerts();
  const { realm: realmName } = useRealm();

  useFetch(
    () => adminClient.realms.findOne({ realm: realmName }),
    setRealm,
    []
  );

  if (!realm) {
    return <KeycloakSpinner />;
  }

  const addComposites = async (composites: RoleRepresentation[]) => {
    const compositeArray = composites;

    try {
      await adminClient.roles.createComposite(
        { roleId: realm.defaultRole!.id!, realm: realmName },
        compositeArray
      );
      setKey(key + 1);
      addAlert(t("roles:addAssociatedRolesSuccess"), AlertVariant.success);
    } catch (error) {
      addError("roles:addAssociatedRolesError", error);
    }
  };

  const userRegistrationRoute = (tab: UserRegistrationSubTab) =>
    routableTab({
      to: toUserRegistrationTab({ realm: realmName, tab }),
      history,
    });

  return (
    <RoutableTabs
      mountOnEnter
      unmountOnExit
      defaultLocation={toUserRegistrationTab({
        realm: realmName,
        tab: "default-roles",
      })}
    >
      <Tab
        key={key}
        id="roles"
        title={<TabTitleText>{t("defaultRoles")}</TabTitleText>}
        {...userRegistrationRoute("default-roles")}
      >
        <RoleMapping
          name={realm.defaultRole!.name!}
          id={realm.defaultRole!.id!}
          type="roles"
          isManager
          save={(rows) => addComposites(rows.map((r) => r.role))}
        />
      </Tab>
      <Tab
        id="groups"
        title={<TabTitleText>{t("defaultGroups")}</TabTitleText>}
        {...userRegistrationRoute("default-groups")}
      >
        <DefaultsGroupsTab />
      </Tab>
    </RoutableTabs>
  );
};
