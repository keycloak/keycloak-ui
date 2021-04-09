import React from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button, PageSection } from "@patternfly/react-core";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { emptyFormatter } from "../util";
import { useAdminClient } from "../context/auth/AdminClient";
import { cellWidth } from "@patternfly/react-table";
import _ from "lodash";
import UserConsentRepresentation from "keycloak-admin/lib/defs/userConsentRepresentation";
import { CubesIcon } from "@patternfly/react-icons";

export const UserConsents = () => {
  const { t } = useTranslation("roles");

  const adminClient = useAdminClient();
  const { id } = useParams<{ id: string }>();
  const alphabetize = (consentsList: UserConsentRepresentation[]) => {
    return _.sortBy(consentsList, (client) => client.clientId?.toUpperCase());
  };

  const loader = async () => {
    const consents = await adminClient.users.listConsents({ id });

    return alphabetize(consents);
  };

  return (
    <>
      <PageSection variant="light">
        <KeycloakDataTable
          loader={loader}
          ariaLabelKey="roles:roleList"
          columns={[
            {
              name: "client",
              displayKey: "clients:Client",
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(20)],
            },
            {
              name: "grantedClientScopes",
              displayKey: "client-scopes:grantedClientScopes",
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(30)],
            },

            {
              name: "createDate",
              displayKey: "clients:created",
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(20)],
            },
            {
              name: "lastUpdatedDate",
              displayKey: "clients:lastUpdated",
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(20)],
            },
          ]}
          emptyState={
            <ListEmptyState
              hasIcon={true}
              icon={CubesIcon}
              message={t("users:noConsents")}
              instructions={
                <div>
                  {" "}
                  {t("users:noConsentsText")}{" "}
                  <Button
                    variant="link"
                    className="kc-settings-link-empty-state"
                  >
                    {t("common:settings") + "."}
                  </Button>
                </div>
              }
              onPrimaryAction={() => {}}
            />
          }
        />
      </PageSection>
    </>
  );
};
