import React from "react";
import {
  Button,
  PageSection,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
} from "@patternfly/react-core";
import { useHistory } from "react-router-dom";

import { PlusCircleIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";

export const NoRealmRolesPage = () => {
  const { t } = useTranslation("realm");
  const history = useHistory();
  const emptyStateText =
    "There aren't any realm roles in this realm. Create a realm role to get started";
  return (
    <>
      <PageSection>
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon icon={PlusCircleIcon} />
          <Title headingLevel="h4" size="lg">
            {t("noRealmRoles")}
          </Title>
          <EmptyStateBody>{t("emptyStateText")}</EmptyStateBody>
          <Button variant="primary" onClick={() => history.push("/add-role")}>
            {t("createRealm")}
          </Button>
        </EmptyState>
      </PageSection>
    </>
  );
};
