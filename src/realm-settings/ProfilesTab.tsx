import React, { useState } from "react";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Label,
  PageSection,
  ToolbarItem,
} from "@patternfly/react-core";
import { Divider, Flex, FlexItem, Radio, Title } from "@patternfly/react-core";
import { CodeEditor, Language } from "@patternfly/react-code-editor";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { useTranslation } from "react-i18next";
import { useAdminClient } from "../context/auth/AdminClient";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { useRealm } from "../context/realm-context/RealmContext";
import { cellWidth, IFormatterValueType } from "@patternfly/react-table";
import { useAlerts } from "../components/alert/Alerts";
import { Link } from "react-router-dom";
import type ClientProfilesRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientProfilesRepresentation";
import "./RealmSettingsSection.css";

export const ProfilesTab = () => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const { realm: realmName } = useRealm();
  const { addAlert, addError } = useAlerts();
  const [profiles, setProfiles] = useState<ClientProfilesRepresentation>();
  const [show, setShow] = useState(false);

  const loader = async () => {
    const clientProfiles = await adminClient.clientPolicies.listProfiles({
      realm: realmName,
      includeGlobalProfiles: true,
    });
    setProfiles(clientProfiles);
    return clientProfiles.globalProfiles;
  };

  function formatChange(show: boolean) {
    setShow(show);
  }

  function createNewProfile() {
    // create a new profile
  }

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteClientProfileConfirmTitle"),
    messageKey: t("deleteClientProfileConfirm"),
    continueButtonLabel: "delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        // delete client profile here await
        addAlert(t("deleteClientSuccess"), AlertVariant.success);
      } catch (error) {
        addError(t("deleteClientError"), error);
      }
    },
  });

  function cellFormatter(name?: IFormatterValueType) {
    return (
      <>
        {profiles?.globalProfiles?.length! > 0 && (
          <>
            <Link to={""} key={`link-${name}`}>
              {name}
            </Link>{" "}
            <Label key={`label-${name}`} color="blue">
              {t("global")}
            </Label>
          </>
        )}
        {profiles?.profiles?.length! > 0 && (
          <Link to={""} key={`link-${name}`}>
            {name}
          </Link>
        )}
      </>
    );
  }

  return (
    <>
      <DeleteConfirm />
      <PageSection>
        <Flex className="kc-profiles-config-section">
          <FlexItem>
            <Title headingLevel="h1" size="md">
              {t("profilesConfigType")}
            </Title>
          </FlexItem>
          <FlexItem>
            <Radio
              isChecked={!show}
              name="fromView"
              onChange={() => formatChange(false)}
              label={t("profilesConfigTypes.fromView")}
              id="fromView-radioBtn"
            />
          </FlexItem>
          <FlexItem>
            <Radio
              isChecked={show}
              name="jsonEditor"
              onChange={() => formatChange(true)}
              label={t("profilesConfigTypes.jsonEditor")}
              id="jsonEditor-radioBtn"
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <Divider />
      {!show ? (
        <KeycloakDataTable
          ariaLabelKey="userEventsRegistered"
          searchPlaceholderKey="realm-settings:clientProfileSearch"
          loader={loader}
          toolbarItem={
            <ToolbarItem>
              <Button
                id="createProfile"
                onClick={() => createNewProfile()}
                data-testid="createProfile"
              >
                {t("createClientProfile")}
              </Button>
            </ToolbarItem>
          }
          actions={[
            {
              title: t("common:delete"),
              onRowClick: () => {
                toggleDeleteDialog();
              },
            },
          ]}
          columns={[
            {
              name: "name",
              displayKey: t("clientProfileName"),
              cellFormatters: [cellFormatter],
              transforms: [cellWidth(10)],
            },
            {
              name: "description",
              displayKey: t("clientProfileDescription"),
            },
          ]}
          emptyState={
            <ListEmptyState
              message={t("emptyClientProfiles")}
              instructions={t("emptyClientProfilesInstructions")}
            />
          }
        />
      ) : (
        <CodeEditor
          isLineNumbersVisible
          isLanguageLabelVisible
          code={JSON.stringify(profiles, null, 2)}
          language={Language.json}
          height={"500px"}
        />
      )}
    </>
  );
};
