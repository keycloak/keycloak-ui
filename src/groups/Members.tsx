import { Button, ToolbarItem } from "@patternfly/react-core";
import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";
import UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAdminClient } from "../context/auth/AdminClient";
import { emptyFormatter } from "../util";
import { getLastId } from "./groupIdUtils";

type MembersOf = UserRepresentation & {
  membership: GroupRepresentation[];
};

export const Members = () => {
  const { t } = useTranslation("groups");
  const adminClient = useAdminClient();
  const id = getLastId(location.pathname);

  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  useEffect(() => {
    refresh();
  }, [id]);

  const getMembership = async (id: string) =>
    await adminClient.users.listGroups({ id: id! });

  const loader = async (first?: number, max?: number) => {
    const members = await adminClient.groups.listMembers({
      id: id!,
      first,
      max,
    });
    const memberOfPromises = await Promise.all(
      members.map((member) => getMembership(member.id!))
    );
    return members.map((member: UserRepresentation, i) => {
      return { ...member, membership: memberOfPromises[i] };
    });
  };

  const MemberOfRenderer = (member: MembersOf) => {
    return (
      <>
        {member.membership.map((group) => (
          <>/{group.name} </>
        ))}
      </>
    );
  };

  return (
    <KeycloakDataTable
      key={key}
      loader={loader}
      ariaLabelKey="groups:members"
      isPaginated
      toolbarItem={
        <>
          <ToolbarItem>
            <Button data-testid="addMember" variant="primary">
              {t("addMember")}
            </Button>
          </ToolbarItem>
        </>
      }
      columns={[
        {
          name: "username",
          displayKey: "common:name",
        },
        {
          name: "email",
          displayKey: "groups:email",
          cellFormatters: [emptyFormatter()],
        },
        {
          name: "firstName",
          displayKey: "groups:firstName",
          cellFormatters: [emptyFormatter()],
        },
        {
          name: "lastName",
          displayKey: "groups:lastName",
          cellFormatters: [emptyFormatter()],
        },
        {
          name: "membership",
          displayKey: "groups:membership",
          cellRenderer: MemberOfRenderer,
        },
      ]}
    />
  );
};
