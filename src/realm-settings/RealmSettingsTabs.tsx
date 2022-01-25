import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { Controller, FormProvider, useForm, useWatch } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  ButtonVariant,
  DropdownItem,
  DropdownSeparator,
  PageSection,
  Tab,
  TabTitleText,
} from "@patternfly/react-core";

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";

import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import {
  routableTab,
  RoutableTabs,
} from "../components/routable-tabs/RoutableTabs";
import { useRealm } from "../context/realm-context/RealmContext";
import { useRealms } from "../context/RealmsContext";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAdminClient } from "../context/auth/AdminClient";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { useAlerts } from "../components/alert/Alerts";
import {
  convertFormValuesToObject,
  convertToFormValues,
  KEY_PROVIDER_TYPE,
  toUpperCase,
} from "../util";

import { RealmSettingsEmailTab } from "./EmailTab";
import { EventsTab } from "./event-config/EventsTab";
import { RealmSettingsGeneralTab } from "./GeneralTab";
import { KeysListTab } from "./KeysListTab";
import { KeysProvidersTab } from "./KeysProvidersTab";
import { RealmSettingsLoginTab } from "./LoginTab";
import { SecurityDefences } from "./security-defences/SecurityDefences";
import { RealmSettingsSessionsTab } from "./SessionsTab";
import { RealmSettingsThemesTab } from "./ThemesTab";
import { RealmSettingsTokensTab } from "./TokensTab";
import ProfilesTab from "./ProfilesTab";
import { PoliciesTab } from "./PoliciesTab";
import { PartialImportDialog } from "./PartialImport";
import { PartialExportDialog } from "./PartialExport";
import { RealmSettingsTab, toRealmSettings } from "./routes/RealmSettings";
import { LocalizationTab } from "./LocalizationTab";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { UserRegistration } from "./UserRegistration";
import { toDashboard } from "../dashboard/routes/Dashboard";
import environment from "../environment";
import helpUrls from "../help-urls";
import { UserProfileTab } from "./user-profile/UserProfileTab";
import useIsFeatureEnabled, { Feature } from "../utils/useIsFeatureEnabled";
import { ClientPoliciesTab, toClientPolicies } from "./routes/ClientPolicies";
import { KeySubTab, toKeysTab } from "./routes/KeysTab";

type RealmSettingsHeaderProps = {
  onChange: (value: boolean) => void;
  value: boolean;
  save: () => void;
  realmName: string;
  refresh: () => void;
};

const RealmSettingsHeader = ({
  save,
  onChange,
  value,
  realmName,
  refresh,
}: RealmSettingsHeaderProps) => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const { refresh: refreshRealms } = useRealms();
  const { addAlert, addError } = useAlerts();
  const history = useHistory();
  const [partialImportOpen, setPartialImportOpen] = useState(false);
  const [partialExportOpen, setPartialExportOpen] = useState(false);

  const [toggleDisableDialog, DisableConfirm] = useConfirmDialog({
    titleKey: "realm-settings:disableConfirmTitle",
    messageKey: "realm-settings:disableConfirm",
    continueButtonLabel: "common:disable",
    onConfirm: () => {
      onChange(!value);
      save();
    },
  });

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "realm-settings:deleteConfirmTitle",
    messageKey: "realm-settings:deleteConfirm",
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.realms.del({ realm: realmName });
        addAlert(t("deletedSuccess"), AlertVariant.success);
        await refreshRealms();
        history.push(toDashboard({ realm: environment.masterRealm }));
        refresh();
      } catch (error) {
        addError("realm-settings:deleteError", error);
      }
    },
  });

  return (
    <>
      <DisableConfirm />
      <DeleteConfirm />
      <PartialImportDialog
        open={partialImportOpen}
        toggleDialog={() => setPartialImportOpen(!partialImportOpen)}
      />
      <PartialExportDialog
        isOpen={partialExportOpen}
        onClose={() => setPartialExportOpen(false)}
      />
      <ViewHeader
        titleKey={toUpperCase(realmName)}
        subKey="realm-settings:realmSettingsExplain"
        helpUrl={helpUrls.realmSettingsUrl}
        divider={false}
        dropdownItems={[
          <DropdownItem
            key="import"
            data-testid="openPartialImportModal"
            onClick={() => {
              setPartialImportOpen(true);
            }}
          >
            {t("partialImport")}
          </DropdownItem>,
          <DropdownItem
            key="export"
            data-testid="openPartialExportModal"
            onClick={() => setPartialExportOpen(true)}
          >
            {t("partialExport")}
          </DropdownItem>,
          <DropdownSeparator key="separator" />,
          <DropdownItem key="delete" onClick={toggleDeleteDialog}>
            {t("common:delete")}
          </DropdownItem>,
        ]}
        isEnabled={value}
        onToggle={(value) => {
          if (!value) {
            toggleDisableDialog();
          } else {
            onChange(value);
            save();
          }
        }}
      />
    </>
  );
};

type RealmSettingsTabsProps = {
  realm: RealmRepresentation;
  refresh: () => void;
  realmComponents: ComponentRepresentation[];
};

export const RealmSettingsTabs = ({
  realm,
  realmComponents,
  refresh,
}: RealmSettingsTabsProps) => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const { addAlert, addError } = useAlerts();
  const { realm: realmName } = useRealm();
  const { refresh: refreshRealms } = useRealms();
  const history = useHistory();
  const isFeatureEnabled = useIsFeatureEnabled();

  const kpComponentTypes =
    useServerInfo().componentTypes?.[KEY_PROVIDER_TYPE] ?? [];

  const form = useForm({ mode: "onChange", shouldUnregister: false });
  const { control, getValues, setValue, reset: resetForm } = form;

  const [key, setKey] = useState(0);

  const refreshHeader = () => {
    setKey(new Date().getTime());
  };

  const setupForm = (r: RealmRepresentation = realm) => {
    convertToFormValues(r, setValue);
    resetForm(getValues());
  };

  useEffect(() => {
    setupForm();
  }, []);

  const save = async (realm: RealmRepresentation) => {
    try {
      realm = convertFormValuesToObject(realm);

      await adminClient.realms.update(
        { realm: realmName },
        {
          ...realm,
          id: realmName,
        }
      );
      setupForm(realm);
      const isRealmRenamed = realmName !== realm.realm;
      if (isRealmRenamed) {
        await refreshRealms();
        history.push(toRealmSettings({ realm: realm.realm!, tab: "general" }));
      }
      addAlert(t("saveSuccess"), AlertVariant.success);
    } catch (error) {
      addError("realm-settings:saveError", error);
    }
  };

  const userProfileEnabled = useWatch({
    control,
    name: "attributes.userProfileEnabled",
    defaultValue: "false",
  });

  const route = (tab: RealmSettingsTab | undefined = "general") =>
    routableTab({
      to: toRealmSettings({ realm: realmName, tab }),
      history,
    });

  const policiesRoute = (tab: ClientPoliciesTab) =>
    routableTab({
      to: toClientPolicies({
        realm: realmName,
        tab,
      }),
      history,
    });

  const keysRoute = (tab: KeySubTab) =>
    routableTab({
      to: toKeysTab({ realm: realmName, tab }),
      history,
    });
  return (
    <>
      <Controller
        name="enabled"
        defaultValue={true}
        control={control}
        render={({ onChange, value }) => (
          <RealmSettingsHeader
            value={value}
            onChange={onChange}
            realmName={realmName}
            refresh={refreshHeader}
            save={() => save(getValues())}
          />
        )}
      />
      <PageSection variant="light" className="pf-u-p-0">
        <FormProvider {...form}>
          <RoutableTabs isBox mountOnEnter>
            <Tab
              title={<TabTitleText>{t("general")}</TabTitleText>}
              data-testid="rs-general-tab"
              {...route()}
            >
              <RealmSettingsGeneralTab
                save={save}
                reset={() => resetForm(realm)}
              />
            </Tab>
            <Tab
              title={<TabTitleText>{t("login")}</TabTitleText>}
              data-testid="rs-login-tab"
              {...route("login")}
            >
              <RealmSettingsLoginTab
                refresh={refresh}
                save={save}
                realm={realm}
              />
            </Tab>
            <Tab
              title={<TabTitleText>{t("email")}</TabTitleText>}
              data-testid="rs-email-tab"
              {...route("email")}
            >
              <RealmSettingsEmailTab realm={realm} />
            </Tab>
            <Tab
              title={<TabTitleText>{t("themes")}</TabTitleText>}
              data-testid="rs-themes-tab"
              {...route("themes")}
            >
              <RealmSettingsThemesTab
                save={save}
                reset={() => resetForm(realm)}
              />
            </Tab>
            <Tab
              title={<TabTitleText>{t("realm-settings:keys")}</TabTitleText>}
              data-testid="rs-keys-tab"
              {...route("keys")}
            >
              <RoutableTabs
                defaultLocation={toKeysTab({ realm: realmName, tab: "list" })}
              >
                <Tab
                  id="keysList"
                  data-testid="rs-keys-list-tab"
                  aria-label="keys-list-subtab"
                  title={<TabTitleText>{t("keysList")}</TabTitleText>}
                  {...keysRoute("list")}
                >
                  <KeysListTab realmComponents={realmComponents} />
                </Tab>
                <Tab
                  id="providers"
                  data-testid="rs-providers-tab"
                  aria-label="rs-providers-tab"
                  title={<TabTitleText>{t("providers")}</TabTitleText>}
                  {...keysRoute("providers")}
                >
                  <KeysProvidersTab
                    realmComponents={realmComponents}
                    keyProviderComponentTypes={kpComponentTypes}
                    refresh={refresh}
                  />
                </Tab>
              </RoutableTabs>
            </Tab>
            <Tab
              title={<TabTitleText>{t("events")}</TabTitleText>}
              data-testid="rs-realm-events-tab"
              {...route("events")}
            >
              <EventsTab />
            </Tab>
            <Tab
              title={<TabTitleText>{t("localization")}</TabTitleText>}
              data-testid="rs-localization-tab"
              {...route("localization")}
            >
              <LocalizationTab
                key={key}
                refresh={refresh}
                save={save}
                reset={() => resetForm(realm)}
                realm={realm}
              />
            </Tab>
            <Tab
              title={<TabTitleText>{t("securityDefences")}</TabTitleText>}
              data-testid="rs-security-defenses-tab"
              {...route("securityDefences")}
            >
              <SecurityDefences save={save} reset={() => resetForm(realm)} />
            </Tab>
            <Tab
              title={
                <TabTitleText>{t("realm-settings:sessions")}</TabTitleText>
              }
              data-testid="rs-sessions-tab"
              {...route("sessions")}
            >
              <RealmSettingsSessionsTab key={key} realm={realm} save={save} />
            </Tab>
            <Tab
              title={<TabTitleText>{t("realm-settings:tokens")}</TabTitleText>}
              data-testid="rs-tokens-tab"
              {...route("tokens")}
            >
              <RealmSettingsTokensTab
                save={save}
                realm={realm}
                reset={() => resetForm(realm)}
              />
            </Tab>
            <Tab
              title={
                <TabTitleText>
                  {t("realm-settings:clientPolicies")}
                </TabTitleText>
              }
              data-testid="rs-clientPolicies-tab"
              {...route("clientPolicies")}
            >
              <RoutableTabs
                mountOnEnter
                defaultLocation={toClientPolicies({
                  realm: realmName,
                  tab: "profiles",
                })}
              >
                <Tab
                  data-testid="rs-policies-clientProfiles-tab"
                  aria-label={t("clientProfilesSubTab")}
                  title={
                    <TabTitleText>
                      {t("profiles")}
                      <span className="kc-help-text">
                        <HelpItem
                          helpText="realm-settings:clientPoliciesProfilesHelpText"
                          fieldLabelId="realm-settings:clientPoliciesProfiles"
                        />
                      </span>
                    </TabTitleText>
                  }
                  {...policiesRoute("profiles")}
                >
                  <ProfilesTab />
                </Tab>
                <Tab
                  id="policies"
                  data-testid="rs-policies-clientPolicies-tab"
                  aria-label={t("clientPoliciesSubTab")}
                  {...policiesRoute("policies")}
                  title={
                    <TabTitleText>
                      {t("policies")}
                      <span className="kc-help-text">
                        <HelpItem
                          helpText="realm-settings:clientPoliciesPoliciesHelpText"
                          fieldLabelId="realm-settings:clientPoliciesPolicies"
                        />
                      </span>
                    </TabTitleText>
                  }
                >
                  <PoliciesTab />
                </Tab>
              </RoutableTabs>
            </Tab>
            {isFeatureEnabled(Feature.DeclarativeUserProfile) &&
              userProfileEnabled === "true" && (
                <Tab
                  title={
                    <TabTitleText>
                      {t("realm-settings:userProfile")}
                    </TabTitleText>
                  }
                  data-testid="rs-user-profile-tab"
                  {...route("userProfile")}
                >
                  <UserProfileTab />
                </Tab>
              )}
            <Tab
              title={<TabTitleText>{t("userRegistration")}</TabTitleText>}
              data-testid="rs-userRegistration-tab"
              {...route("userRegistration")}
            >
              <UserRegistration />
            </Tab>
          </RoutableTabs>
        </FormProvider>
      </PageSection>
    </>
  );
};
