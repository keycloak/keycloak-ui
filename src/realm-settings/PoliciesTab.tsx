import React from "react";
import { PageSection, Switch } from "@patternfly/react-core";

import "./RealmSettingsSection.css";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../context/auth/AdminClient";

export const PoliciesTab = () => {
  const { t } = useTranslation("identity-providers");
  const adminClient = useAdminClient();

  // const form = useForm<ClientPolicyRepresentation>({ mode: "onChange" });

  const EnabledRenderer = () => {
    return (
      <>
        {" "}
        <Switch
          id="multiValued"
          label={t("common:on")}
          labelOff={t("common:off")}
          isChecked={true}
          // onChange={(value) => onChange(!value)}
        />
      </>
    );
  };

  const loader = async () => {
    const policies = await adminClient.clientPolicies.listPolicies();
    return policies.policies!;
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
            displayKey: "realm-settings:status",
            // cellFormatters: [upperCaseFormatter()],
            cellRenderer: EnabledRenderer,
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
