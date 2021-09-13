import React from "react";
import { PageSection } from "@patternfly/react-core";

import "./RealmSettingsSection.css";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../context/auth/AdminClient";
import { getBaseUrl, upperCaseFormatter } from "../util";
import { useRealm } from "../context/realm-context/RealmContext";

export const PoliciesTab = () => {
  const { t } = useTranslation("identity-providers");
  const adminClient = useAdminClient();
  const { realm } = useRealm();

  const loader = async () => {
    //TODO: remove when clientPolicies.listPolicies() endpoint is merged
    const response = await fetch(
      `${getBaseUrl(
        adminClient
      )}admin/realms/${realm}/client-policies/policies`,
      {
        method: "GET",
        headers: {
          Authorization: `bearer ${await adminClient.getAccessToken()}`,
        },
      }
    );

    const result = await response.json();
    console.log(result?.policies);
    return result?.policies;

    // TODO: use this call once the code above can be removed
    // const profiles = await adminClient.clientPolicies.listPolicies();
    // return profiles?.profiles
  };

  return (
    <PageSection variant="light" padding={{ default: "noPadding" }}>
      <KeycloakDataTable
        emptyState={
          <ListEmptyState
            message={t("identity-providers:noMappers")}
            instructions={t("identity-providers:noMappersInstructions")}
            primaryActionText={t("identity-providers:addMapper")}
          />
        }
        loader={loader}
        isPaginated
        ariaLabelKey="identity-providers:mappersList"
        searchPlaceholderKey="identity-providers:searchForMapper"
        columns={[
          {
            name: "name",
            displayKey: "common:name",
          },
          {
            name: "enabled",
            displayKey: "common:enabled",
            cellFormatters: [upperCaseFormatter()],
          },
          {
            name: "description",
            displayKey: "common:description",
          },
        ]}
      />
    </PageSection>
  );
};
