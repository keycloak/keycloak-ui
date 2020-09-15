import React from "react";
import {
  Button,
  PageSection,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  Text,
  EmptyStateBody,
} from "@patternfly/react-core";
import { useHistory } from "react-router-dom";

import { PlusCircleIcon } from "@patternfly/react-icons";

export const NoRealmRolesPage = () => {
  const history = useHistory();
  const emptyStateText = "There aren't any realm roles in this realm. Create a realm role to get started"
  return (
    <>
      <PageSection>
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon icon={PlusCircleIcon} />
          <Title headingLevel="h4" size="lg">
            No realm roles
          </Title>
          <EmptyStateBody>
            {emptyStateText}.
          </EmptyStateBody>
          <Button variant="primary" onClick={() => history.push("/add-role")}>
            Create Realm
          </Button>
        </EmptyState>
      </PageSection>
    </>
  );
};
