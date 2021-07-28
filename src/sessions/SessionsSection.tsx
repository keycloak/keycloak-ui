import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  DropdownItem,
  PageSection,
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core";
import moment from "moment";
import type UserSessionRepresentation from "keycloak-admin/lib/defs/userSessionRepresentation";

import { ViewHeader } from "../components/view-header/ViewHeader";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAdminClient } from "../context/auth/AdminClient";
import { CubesIcon, FilterIcon } from "@patternfly/react-icons";
import "./SessionsSection.css";
import { RevocationModal } from "./RevocationModal";
import type ClientRepresentation from "keycloak-admin/lib/defs/clientRepresentation";
import { LogoutAllSessionsModal } from "./LogoutAllSessionsModal";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";

const Clients = (row: UserSessionRepresentation) => {
  return (
    <>
      {Object.values(row.clients!).map((client) => (
        <Link key={client} to="" className="pf-u-mx-sm">
          {client}
        </Link>
      ))}
    </>
  );
};

export const SessionsSection = () => {
  const { t } = useTranslation("sessions");
  const adminClient = useAdminClient();
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [revocationModalOpen, setRevocationModalOpen] = useState(false);
  const [logoutAllSessionsModalOpen, setLogoutAllSessionsModalOpen] =
    useState(false);
  const [activeClientDetails, setActiveClientDetails] = useState<
    ClientRepresentation[]
  >([]);
  const [filterType, setFilterType] = useState(
    t("sessionsType.allSessions").toString()
  );
  const [key, setKey] = useState(0);
  const [noSessions, setNoSessions] = useState(false);

  const refresh = () => {
    setKey(new Date().getTime());
  };

  const handleRevocationModalToggle = () => {
    setRevocationModalOpen(!revocationModalOpen);
  };

  const handleLogoutAllSessionsModalToggle = () => {
    setLogoutAllSessionsModalOpen(!logoutAllSessionsModalOpen);
  };

  const loader = async () => {
    const activeClients = await adminClient.sessions.find();
    const clientSessions = (
      await Promise.all(
        activeClients.map((client) =>
          adminClient.clients.listSessions({ id: client.id })
        )
      )
    ).flat();

    setNoSessions(clientSessions.length === 0);

    const allClients = await adminClient.clients.find();

    const getActiveClientDetails = allClients.filter((x) =>
      activeClients.map((y) => y.id).includes(x.id)
    );

    setActiveClientDetails(getActiveClientDetails);

    const userIds = Array.from(
      new Set(clientSessions.map((session) => session.userId))
    );
    const userSessions = (
      await Promise.all(
        userIds.map((userId) => adminClient.users.listSessions({ id: userId! }))
      )
    ).flat();

    return userSessions;
  };

  const dropdownItems = [
    <DropdownItem
      key="toggle-modal"
      data-testid="revocation"
      component="button"
      onClick={() => handleRevocationModalToggle()}
    >
      {t("revocation")}
    </DropdownItem>,
    <DropdownItem
      key="delete-role"
      data-testid="logout-all"
      component="button"
      onClick={() => handleLogoutAllSessionsModalToggle()}
    >
      {t("signOutAllActiveSessions")}
    </DropdownItem>,
  ];

  return (
    <>
      <ViewHeader
        dropdownItems={dropdownItems}
        dropdownIsDisabled={noSessions}
        titleKey="sessions:title"
        subKey="sessions:sessionExplain"
      />
      <PageSection variant="light" className="pf-u-p-0">
        {revocationModalOpen && (
          <RevocationModal
            handleModalToggle={handleRevocationModalToggle}
            activeClients={activeClientDetails}
            save={() => {
              handleRevocationModalToggle();
            }}
          />
        )}
        {logoutAllSessionsModalOpen && (
          <LogoutAllSessionsModal
            handleModalToggle={handleLogoutAllSessionsModalToggle}
          />
        )}
        <KeycloakDataTable
          key={key}
          loader={loader}
          ariaLabelKey="session:title"
          searchPlaceholderKey="sessions:searchForSession"
          emptyState={
            <ListEmptyState
              hasIcon
              icon={CubesIcon}
              message={t("noSessions")}
              instructions={t("noSessionsDescription")}
            />
          }
          searchTypeComponent={
            <Select
              data-testid="filter-session-type-select"
              isOpen={filterDropdownOpen}
              className="kc-filter-session-type-select"
              variant={SelectVariant.single}
              onToggle={(isExpanded) => setFilterDropdownOpen(isExpanded)}
              toggleIcon={<FilterIcon />}
              onSelect={(_, value) => {
                setFilterType(value.toString());
                refresh();
                setFilterDropdownOpen(false);
              }}
              selections={filterType}
            >
              <SelectOption
                key={0}
                data-testid="all-sessions-option"
                value={t("sessionsType.allSessions")}
                isPlaceholder
              />
              <SelectOption
                key={1}
                data-testid="regular-sso-option"
                value={t("sessionsType.regularSSO")}
              />
              <SelectOption
                key={2}
                data-testid="offline-option"
                value={t("sessionsType.offline")}
              />
              <SelectOption
                key={3}
                data-testid="direct-grant-option"
                value={t("sessionsType.directGrant")}
              />
              <SelectOption
                key={4}
                data-testid="service-account-option"
                value={t("sessionsType.serviceAccount")}
              />
            </Select>
          }
          columns={[
            {
              name: "username",
              displayKey: "sessions:subject",
            },
            {
              name: "lastAccess",
              displayKey: "sessions:lastAccess",
              cellRenderer: (row) => moment(row.lastAccess).fromNow(),
            },
            {
              name: "start",
              displayKey: "sessions:startDate",
              cellRenderer: (row) => moment(row.lastAccess).format("LLL"),
            },
            {
              name: "clients",
              displayKey: "sessions:accessedClients",
              cellRenderer: Clients,
            },
          ]}
        />
      </PageSection>
    </>
  );
};
