import React from "react";
import { PageSection } from "@patternfly/react-core";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAdminClient } from "../context/auth/AdminClient";
import { UserGroups } from "./UserGroups";

export const UserGroupsSection = () => {
  const adminClient = useAdminClient();

  const loader = async () => {
    return await adminClient.users.listGroups();
  };
  return (
    <>
      <ViewHeader titleKey="roles:title" subKey="roles:roleExplain" />
      <PageSection variant="light">
        <UserGroups loader={loader} />
      </PageSection>
    </>
  );
};
