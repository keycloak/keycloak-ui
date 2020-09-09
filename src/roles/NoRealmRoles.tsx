import React from "react";
import {
  Button,
  Page,
  PageSection,
  EmptyState,
  Text,
  TextContent,
  EmptyStateVariant,
  EmptyStateIcon,
  Title,
  EmptyStateBody,
} from "@patternfly/react-core";
import { useHistory } from "react-router-dom";

import { PlusCircleIcon } from "@patternfly/react-icons";

export const NoRealmRolesPage = () => {
  const history = useHistory();
  return (
    <>
      <PageSection>
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon icon={PlusCircleIcon} />
          <Title headingLevel="h4" size="lg">
            No realm roles
          </Title>
          <EmptyStateBody>
            There aren't any realm roles in this realm. Create a realm role to
            get started.
          </EmptyStateBody>
          <Button variant="primary" onClick={() => history.push("/add-role")}>
            Create Realm
          </Button>
        </EmptyState>
      </PageSection>
    </>
  );
};
