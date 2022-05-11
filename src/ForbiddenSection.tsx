import React from "react";
import { PageSection } from "@patternfly/react-core";

import type { AccessType } from "@keycloak/keycloak-admin-client/lib/defs/whoAmIRepresentation";

type ForbiddenSectionProps = {
  permissionNeeded: AccessType | AccessType[];
};

export const ForbiddenSection = ({
  permissionNeeded,
}: ForbiddenSectionProps) => {
  return (
    <PageSection>Forbidden, permission needed: {permissionNeeded}</PageSection>
  );
};
