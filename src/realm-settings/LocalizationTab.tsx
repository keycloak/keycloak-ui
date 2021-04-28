import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext, useWatch } from "react-hook-form";
import {
  ActionGroup,
  Button,
  FormGroup,
  KebabToggle,
  PageSection,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  ToolbarItem,
} from "@patternfly/react-core";

import type RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import { FormAccess } from "../components/form-access/FormAccess";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { FormPanel } from "../components/scroll-form/FormPanel";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAdminClient } from "../context/auth/AdminClient";

type LocalizationTabProps = {
  save: (realm: RealmRepresentation) => void;
  reset: () => void;
};

export const LocalizationTab = ({ save, reset }: LocalizationTabProps) => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();

  const [supportedLocalesOpen, setSupportedLocalesOpen] = useState(false);
  const [defaultLocaleOpen, setDefaultLocaleOpen] = useState(false);

  const { control, handleSubmit } = useFormContext();

  const themeTypes = useServerInfo().themes!;

  const watchSupportedLocales = useWatch({
    control,
    name: "supportedLocales",
    defaultValue: themeTypes?.account![0].locales,
  });

  const internationalizationEnabled = useWatch({
    control,
    name: "internationalizationEnabled",
    defaultValue: false,
  });

  const loader = async () => {
    const test = await adminClient.realms.find();
    console.log(test[0].supportedLocales);
    return test[0].supportedLocales;
  };

  return (
    <>
      <PageSection variant="light">
        <FormPanel
          className="kc-login-screen"
          title="Login screen customization"
        >
          <FormAccess
            isHorizontal
            role="manage-realm"
            className="pf-u-mt-lg"
            onSubmit={handleSubmit(save)}
          >
            <FormGroup
              label={t("internationalization")}
              fieldId="kc-internationalization"
            >
              <Controller
                name="internationalizationEnabled"
                control={control}
                defaultValue={false}
                render={({ onChange, value }) => (
                  <Switch
                    id="kc-internationalization"
                    label={t("common:enabled")}
                    labelOff={t("common:disabled")}
                    isChecked={internationalizationEnabled}
                    data-testid={
                      value
                        ? "internationalization-enabled"
                        : "internationalization-disabled"
                    }
                    onChange={onChange}
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
                    control={control}
                    defaultValue={themeTypes?.account![0].locales}
                    render={({ value, onChange }) => (
                      <Select
                        toggleId="kc-supported-locales"
                        onToggle={() => {
                          setSupportedLocalesOpen(!supportedLocalesOpen);
                        }}
                        onSelect={(_, v) => {
                          const option = v as string;
                          if (!value) {
                            onChange([option]);
                          } else if (value!.includes(option)) {
                            onChange(
                              value.filter((item: string) => item !== option)
                            );
                          } else {
                            onChange([...value, option]);
                          }
                        }}
                        onClear={() => {
                          onChange([]);
                        }}
                        selections={value}
                        variant={SelectVariant.typeaheadMulti}
                        aria-label={t("supportedLocales")}
                        isOpen={supportedLocalesOpen}
                        placeholderText={"Select locales"}
                      >
                        {themeTypes?.login![0].locales.map(
                          (locale: string, idx: number) => (
                            <SelectOption
                              selected={true}
                              key={`locale-${idx}`}
                              value={locale}
                            >
                              {t(`allSupportedLocales.${locale}`)}
                            </SelectOption>
                          )
                        )}
                      </Select>
                    )}
                  />
                </FormGroup>
                <FormGroup
                  label={t("defaultLocale")}
                  fieldId="kc-default-locale"
                >
                  <Controller
                    name="defaultLocale"
                    control={control}
                    defaultValue=""
                    render={({ onChange, value }) => (
                      <Select
                        toggleId="kc-default-locale"
                        onToggle={() =>
                          setDefaultLocaleOpen(!defaultLocaleOpen)
                        }
                        onSelect={(_, value) => {
                          onChange(value as string);
                          setDefaultLocaleOpen(false);
                        }}
                        selections={value && t(`allSupportedLocales.${value}`)}
                        variant={SelectVariant.single}
                        aria-label={t("defaultLocale")}
                        isOpen={defaultLocaleOpen}
                        placeholderText="Select one"
                        data-testid="select-default-locale"
                      >
                        {watchSupportedLocales.map(
                          (locale: string, idx: number) => (
                            <SelectOption
                              key={`default-locale-${idx}`}
                              value={locale}
                            >
                              {t(`allSupportedLocales.${locale}`)}
                            </SelectOption>
                          )
                        )}
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
              <Button variant="link" onClick={reset}>
                {t("common:revert")}
              </Button>
            </ActionGroup>
          </FormAccess>
        </FormPanel>

        <FormPanel className="kc-login-screen" title="Edit message bundle">
          <FormAccess
            isHorizontal
            role="manage-realm"
            className="pf-u-mt-lg"
            onSubmit={handleSubmit(save)}
          >
            <KeycloakDataTable
              //   key={key}
              loader={loader}
              ariaLabelKey="client-scopes:clientScopeList"
              searchPlaceholderKey="client-scopes:searchFor"
              //   onSelect={(clientScopes) => setSelectedScopes([...clientScopes])}
              canSelectAll
              toolbarItem={
                <>
                  <ToolbarItem>
                    {/* <Button onClick={() => history.push(`${url}/new`)}>
                  {t("createClientScope")}
                </Button> */}
                  </ToolbarItem>
                  <ToolbarItem>
                    {/* <Dropdown
                  toggle={
                    <KebabToggle onToggle={() => setKebabOpen(!kebabOpen)} />
                  }
                  isOpen={kebabOpen}
                  isPlain
                  dropdownItems={[
                    <DropdownItem
                      key="changeType"
                      component="button"
                      isDisabled={selectedScopes.length === 0}
                      onClick={() => {
                        setChangeTypeOpen(true);
                        setKebabOpen(false);
                      }}
                    >
                      {t("changeType")}
                    </DropdownItem>,

                    <DropdownItem
                      key="action"
                      component="button"
                      isDisabled={selectedScopes.length === 0}
                      onClick={() => {
                        toggleDeleteDialog();
                        setKebabOpen(false);
                      }}
                    >
                      {t("common:delete")}
                    </DropdownItem>,
                  ]}
                /> */}
                  </ToolbarItem>
                </>
              }
              columns={[
                {
                  name: "key",
                },
                {
                  name: "value",
                },
              ]}
            />
          </FormAccess>
        </FormPanel>
      </PageSection>
    </>
  );
};
