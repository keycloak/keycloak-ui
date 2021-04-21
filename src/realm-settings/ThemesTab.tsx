import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { useErrorHandler } from "react-error-boundary";
import {
  ActionGroup,
  AlertVariant,
  Button,
  ClipboardCopy,
  FormGroup,
  PageSection,
  Select,
  SelectOption,
  SelectVariant,
  Stack,
  StackItem,
  Switch,
  TextInput,
} from "@patternfly/react-core";

import RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import { getBaseUrl } from "../util";
import { useAdminClient, asyncStateFetch } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";
import { useAlerts } from "../components/alert/Alerts";
import { FormAccess } from "../components/form-access/FormAccess";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { FormattedLink } from "../components/external-link/FormattedLink";
import { support } from "cypress/types/jquery";

export const RealmSettingsThemesTab = () => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const handleError = useErrorHandler();
  const { realm: realmName } = useRealm();
  const { addAlert } = useAlerts();
  const { register, control, setValue, handleSubmit } = useForm();
  const [realm, setRealm] = useState<RealmRepresentation>();
  const [open, setOpen] = useState(false);

  const [loginThemeOpen, setLoginThemeOpen] = useState(false);
  const [accountThemeOpen, setAccountThemeOpen] = useState(false);
  const [adminConsoleThemeOpen, setAdminConsoleThemeOpen] = useState(false);
  const [emailThemeOpen, setEmailThemeOpen] = useState(false);
  const [
    internationalizationEnabled,
    setInternationalizationEnabled,
  ] = useState(false);
  const [supportedLocalesOpen, setSupportedLocalesOpen] = useState(false);
  const [defaultLocaleOpen, setDefaultLocaleOpen] = useState(false);

  //   const baseUrl = getBaseUrl(adminClient);

  const themeTypes = ["base", "keycloak", "keycloakV2"];
  const supportedLocales = [
    "ca",
    "cs",
    "da",
    "de",
    "en",
    "es",
    "fr",
    "hu",
    "it",
    "ja",
    "lt",
    "nl",
    "no",
    "pl",
    "ptBR",
    "ru",
    "sk",
    "sv",
    "tr",
    "zhCN",
  ];

  const [selections, setSelections] = useState<string[]>(supportedLocales);

  useEffect(() => {
    return asyncStateFetch(
      () => adminClient.realms.findOne({ realm: realmName }),
      (realm) => {
        setRealm(realm);
        setupForm(realm);
      },
      handleError
    );
  }, []);

  const setupForm = (realm: RealmRepresentation) => {
    Object.entries(realm).map((entry) => setValue(entry[0], entry[1]));
  };

  const save = async (realm: RealmRepresentation) => {
    try {
      await adminClient.realms.update({ realm: realmName }, realm);
      setRealm(realm);
      addAlert(t("saveSuccess"), AlertVariant.success);
    } catch (error) {
      addAlert(t("saveError", { error }), AlertVariant.danger);
    }
  };

  console.log("selections", selections);
  return (
    <>
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          role="manage-realm"
          className="pf-u-mt-lg"
          onSubmit={handleSubmit(save)}
        >
          <FormGroup
            label={t("loginTheme")}
            fieldId="kc-login-theme"
            labelIcon={
              <HelpItem
                helpText="realm-settings-help:loginTheme"
                forLabel={t("loginTheme")}
                forID="kc-login-theme"
              />
            }
          >
            <Controller
              name="loginTheme"
              defaultValue="Select a theme"
              control={control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="kc-login-theme"
                  onToggle={() => setLoginThemeOpen(!loginThemeOpen)}
                  onSelect={(_, value) => {
                    onChange(value as string);
                    setLoginThemeOpen(false);
                  }}
                  selections={value}
                  variant={SelectVariant.single}
                  aria-label={t("loginTheme")}
                  isOpen={loginThemeOpen}
                  placeholderText="Select a theme"
                >
                  {themeTypes.map((theme) => (
                    <SelectOption
                      selected={theme === value}
                      key={theme}
                      value={theme}
                    >
                      {t(`themeTypes.${theme}`)}
                    </SelectOption>
                  ))}
                </Select>
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("accountTheme")}
            fieldId="kc-account-theme"
            labelIcon={
              <HelpItem
                helpText="realm-settings-help:accountTheme"
                forLabel={t("accountTheme")}
                forID="kc-account-theme"
              />
            }
          >
            <Controller
              name="accountTheme"
              defaultValue="Select a theme"
              control={control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="kc-account-theme"
                  onToggle={() => setAccountThemeOpen(!accountThemeOpen)}
                  onSelect={(_, value) => {
                    onChange(value as string);
                    setAccountThemeOpen(false);
                  }}
                  selections={value}
                  variant={SelectVariant.single}
                  aria-label={t("accountTheme")}
                  isOpen={accountThemeOpen}
                  placeholderText="Select a theme"
                >
                  {themeTypes.map((theme) => (
                    <SelectOption
                      selected={theme === value}
                      key={theme}
                      value={theme}
                    >
                      {t(`themeTypes.${theme}`)}
                    </SelectOption>
                  ))}
                </Select>
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("adminTheme")}
            fieldId="kc-admin-console-theme"
            labelIcon={
              <HelpItem
                helpText="realm-settings-help:adminTheme"
                forLabel={t("requireSsl")}
                forID="kc-admin-console-theme"
              />
            }
          >
            <Controller
              name="adminTheme"
              defaultValue="Select a theme"
              control={control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="kc-admin-console-theme"
                  onToggle={() =>
                    setAdminConsoleThemeOpen(!adminConsoleThemeOpen)
                  }
                  onSelect={(_, value) => {
                    onChange(value as string);
                    setAdminConsoleThemeOpen(false);
                  }}
                  selections={value}
                  variant={SelectVariant.single}
                  aria-label={t("adminConsoleTheme")}
                  isOpen={adminConsoleThemeOpen}
                  placeholderText="Select a theme"
                >
                  {themeTypes.map((theme) => (
                    <SelectOption
                      selected={theme === value}
                      key={theme}
                      value={theme}
                    >
                      {t(`themeTypes.${theme}`)}
                    </SelectOption>
                  ))}
                </Select>
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("emailTheme")}
            fieldId="kc-email-theme"
            labelIcon={
              <HelpItem
                helpText="realm-settings-help:emailTheme"
                forLabel={t("emailTheme")}
                forID="kc-email-theme"
              />
            }
          >
            <Controller
              name="emailTheme"
              defaultValue={t("selectATheme")}
              control={control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="kc-email-theme"
                  onToggle={() => setEmailThemeOpen(!emailThemeOpen)}
                  onSelect={(_, value) => {
                    onChange(value as string);
                    setEmailThemeOpen(false);
                  }}
                  selections={value}
                  variant={SelectVariant.single}
                  aria-label={t("emailTheme")}
                  isOpen={emailThemeOpen}
                  placeholderText="Select a theme"
                >
                  {themeTypes.map((theme) => (
                    <SelectOption
                      selected={theme === value}
                      key={theme}
                      value={theme}
                    >
                      {t(`themeTypes.${theme}`)}
                    </SelectOption>
                  ))}
                </Select>
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("internationalization")}
            fieldId="kc-internationalization"
          >
            <Controller
              name="internationalizationEnabled"
              defaultValue="none"
              control={control}
              render={({ onChange }) => (
                <Switch
                  id="kc-internationalization"
                  data-testid="internationalization-switch"
                  label={t("common:enabled")}
                  labelOff={t("common:disabled")}
                  isChecked={internationalizationEnabled}
                  onChange={(value) => {
                    onChange();
                    setInternationalizationEnabled(value);
                  }}
                />
              )}
            />
          </FormGroup>
          {internationalizationEnabled && (
            <>
              <FormGroup
                label={t("supportedLocales")}
                fieldId="kc-supported-locales"
              >
                <Controller
                  name="supportedLocales"
                  //   defaultValue="none"
                  control={control}
                  render={({ onChange }) => (
                    <Select
                      toggleId="kc-supported-locales"
                      onToggle={() =>
                        setSupportedLocalesOpen(!supportedLocalesOpen)
                      }
                      onSelect={(_, value) => {
                        onChange(value as string);
                        setSupportedLocalesOpen(false);
                        setSelections([...selections, value as string]);
                      }}
                      selections={supportedLocales}
                      variant={SelectVariant.typeaheadMulti}
                      aria-label={t("supportedLocales")}
                      isOpen={supportedLocalesOpen}
                    >
                      {supportedLocales.map((locale) => (
                        <SelectOption
                          selected={true}
                          key={locale}
                          value={locale}
                        >
                          {t(`allSupportedLocales.${locale}`)}
                        </SelectOption>
                      ))}
                    </Select>
                  )}
                />
              </FormGroup>
              <FormGroup label={t("defaultLocale")} fieldId="kc-default-locale">
                <Controller
                  name="defaultLocales"
                  defaultValue="none"
                  control={control}
                  render={({ onChange, value }) => (
                    <Select
                      toggleId="kc-default-locale"
                      onToggle={() => setDefaultLocaleOpen(!defaultLocaleOpen)}
                      onSelect={(_, value) => {
                        onChange(value as string);
                        setDefaultLocaleOpen(false);
                      }}
                      selections={value}
                      variant={SelectVariant.single}
                      aria-label={t("defaultLocale")}
                      isOpen={defaultLocaleOpen}
                    >
                      {supportedLocales.map((locale) => (
                        <SelectOption
                          // selected={locale === value}
                          key={locale}
                          value={locale}
                        >
                          {t(`allSupportedLocales.${locale}`)}
                        </SelectOption>
                      ))}
                    </Select>
                  )}
                />
              </FormGroup>
            </>
          )}

          <ActionGroup>
            <Button
              variant="primary"
              type="submit"
              data-testid="themes-tab-save"
            >
              {t("common:save")}
            </Button>
            <Button variant="link" onClick={() => setupForm(realm!)}>
              {t("common:revert")}
            </Button>
          </ActionGroup>
        </FormAccess>
      </PageSection>
    </>
  );
};
