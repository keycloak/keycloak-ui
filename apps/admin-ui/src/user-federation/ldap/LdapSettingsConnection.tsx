import {
  AlertVariant,
  Button,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { get, isEqual } from "lodash-es";

import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import type TestLdapConnectionRepresentation from "@keycloak/keycloak-admin-client/lib/defs/testLdapConnection";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { Controller, UseFormReturn, useWatch } from "react-hook-form";
import { FormAccess } from "../../components/form-access/FormAccess";
import { WizardSectionHeader } from "../../components/wizard-section-header/WizardSectionHeader";
import { PasswordInput } from "../../components/password-input/PasswordInput";
import { useAdminClient } from "../../context/auth/AdminClient";
import { useRealm } from "../../context/realm-context/RealmContext";
import { useAlerts } from "../../components/alert/Alerts";
import { KeycloakTextInput } from "../../components/keycloak-text-input/KeycloakTextInput";

export type LdapSettingsConnectionProps = {
  form: UseFormReturn<ComponentRepresentation>;
  id?: string;
  showSectionHeading?: boolean;
  showSectionDescription?: boolean;
};

const testLdapProperties: Array<keyof TestLdapConnectionRepresentation> = [
  "connectionUrl",
  "bindDn",
  "bindCredential",
  "useTruststoreSpi",
  "connectionTimeout",
  "startTls",
  "authType",
];

type TestTypes = "testConnection" | "testAuthentication";

export const convertFormToSettings = (
  form: UseFormReturn<ComponentRepresentation>
) => {
  const settings: TestLdapConnectionRepresentation = {};

  testLdapProperties.forEach((key) => {
    const value = get(form.getValues(), `config.${key}`);
    settings[key] = Array.isArray(value) ? value[0] : "";
  });

  return settings;
};

export const LdapSettingsConnection = ({
  form,
  id,
  showSectionHeading = false,
  showSectionDescription = false,
}: LdapSettingsConnectionProps) => {
  const { t } = useTranslation("user-federation");
  const { t: helpText } = useTranslation("user-federation-help");
  const { adminClient } = useAdminClient();
  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();
  const edit = !!id;

  const testLdap = async (testType: TestTypes) => {
    try {
      const settings = convertFormToSettings(form);
      await adminClient.realms.testLDAPConnection(
        { realm },
        { ...settings, action: testType, componentId: id }
      );
      addAlert(t("testSuccess"), AlertVariant.success);
    } catch (error) {
      addError("user-federation:testError", error);
    }
  };

  const [isTruststoreSpiDropdownOpen, setIsTruststoreSpiDropdownOpen] =
    useState(false);

  const [isBindTypeDropdownOpen, setIsBindTypeDropdownOpen] = useState(false);

  const ldapBindType = useWatch({
    control: form.control,
    name: "config.authType",
    defaultValue: ["simple"],
  });

  const {
    formState: { errors },
  } = form;

  return (
    <>
      {showSectionHeading && (
        <WizardSectionHeader
          title={t("connectionAndAuthenticationSettings")}
          description={helpText(
            "ldapConnectionAndAuthorizationSettingsDescription"
          )}
          showDescription={showSectionDescription}
        />
      )}
      <FormAccess role="manage-realm" isHorizontal>
        <FormGroup
          label={t("connectionURL")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:consoleDisplayConnectionUrlHelp"
              fieldLabelId="user-federation:connectionURL"
            />
          }
          fieldId="kc-console-connection-url"
          isRequired
          validated={errors.config?.connectionUrl ? "error" : "default"}
          helperTextInvalid={
            errors.config?.connectionUrl ? t("validateConnectionUrl") : ""
          }
        >
          <KeycloakTextInput
            isRequired
            type="text"
            id="kc-console-connection-url"
            data-testid="ldap-connection-url"
            validated={errors.config?.connectionUrl ? "error" : "default"}
            {...form.register("config.connectionUrl.0", {
              required: true,
            })}
          />
        </FormGroup>
        <FormGroup
          label={t("enableStartTls")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:enableStartTlsHelp"
              fieldLabelId="user-federation:enableStartTls"
            />
          }
          fieldId="kc-enable-start-tls"
          hasNoPaddingTop
        >
          <Controller
            name="config.startTls"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id={"kc-enable-start-tls"}
                data-testid="enable-start-tls"
                isDisabled={false}
                onChange={(value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
                aria-label={t("enableStartTls")}
              />
            )}
          ></Controller>
        </FormGroup>

        <FormGroup
          label={t("useTruststoreSpi")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:useTruststoreSpiHelp"
              fieldLabelId="user-federation:useTruststoreSpi"
            />
          }
          fieldId="kc-use-truststore-spi"
        >
          <Controller
            name="config.useTruststoreSpi[0]"
            control={form.control}
            defaultValue="ldapsOnly"
            render={({ field }) => (
              <Select
                toggleId="kc-use-truststore-spi"
                onToggle={() =>
                  setIsTruststoreSpiDropdownOpen(!isTruststoreSpiDropdownOpen)
                }
                isOpen={isTruststoreSpiDropdownOpen}
                onSelect={(_, value) => {
                  field.onChange(value.toString());
                  setIsTruststoreSpiDropdownOpen(false);
                }}
                selections={field.value}
              >
                <SelectOption value="always">{t("always")}</SelectOption>
                <SelectOption value="ldapsOnly">{t("onlyLdaps")}</SelectOption>
                <SelectOption value="never">{t("never")}</SelectOption>
              </Select>
            )}
          ></Controller>
        </FormGroup>
        <FormGroup
          label={t("connectionPooling")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:connectionPoolingHelp"
              fieldLabelId="user-federation:connectionPooling"
            />
          }
          fieldId="kc-connection-pooling"
          hasNoPaddingTop
        >
          <Controller
            name="config.connectionPooling"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id={"kc-connection-pooling"}
                data-testid="connection-pooling"
                isDisabled={false}
                onChange={(value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
                aria-label={t("connectionPooling")}
              />
            )}
          ></Controller>
        </FormGroup>
        <FormGroup
          label={t("connectionTimeout")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:connectionTimeoutHelp"
              fieldLabelId="user-federation:consoleTimeout"
            />
          }
          fieldId="kc-console-connection-timeout"
        >
          <KeycloakTextInput
            type="number"
            min={0}
            id="kc-console-connection-timeout"
            data-testid="connection-timeout"
            {...form.register("config.connectionTimeout.0")}
          />
        </FormGroup>
        <FormGroup fieldId="kc-test-connection-button">
          <Button
            variant="secondary"
            id="kc-test-connection-button"
            data-testid="test-connection-button"
            onClick={() => testLdap("testConnection")}
          >
            {t("common:testConnection")}
          </Button>
        </FormGroup>
        <FormGroup
          label={t("bindType")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:bindTypeHelp"
              fieldLabelId="user-federation:bindType"
            />
          }
          fieldId="kc-bind-type"
          isRequired
        >
          <Controller
            name="config.authType.0"
            defaultValue="simple"
            control={form.control}
            render={({ field }) => (
              <Select
                toggleId="kc-bind-type"
                required
                onToggle={() =>
                  setIsBindTypeDropdownOpen(!isBindTypeDropdownOpen)
                }
                isOpen={isBindTypeDropdownOpen}
                onSelect={(_, value) => {
                  field.onChange(value as string);
                  setIsBindTypeDropdownOpen(false);
                }}
                selections={field.value}
                variant={SelectVariant.single}
                data-testid="ldap-bind-type"
              >
                <SelectOption value="simple" />
                <SelectOption value="none" />
              </Select>
            )}
          ></Controller>
        </FormGroup>

        {isEqual(ldapBindType, ["simple"]) && (
          <>
            <FormGroup
              label={t("bindDn")}
              labelIcon={
                <HelpItem
                  helpText="user-federation-help:bindDnHelp"
                  fieldLabelId="user-federation:bindDn"
                />
              }
              fieldId="kc-console-bind-dn"
              helperTextInvalid={t("validateBindDn")}
              validated={
                errors.config?.bindDn
                  ? ValidatedOptions.error
                  : ValidatedOptions.default
              }
              isRequired
            >
              <KeycloakTextInput
                type="text"
                id="kc-console-bind-dn"
                data-testid="ldap-bind-dn"
                validated={
                  errors.config?.bindDn
                    ? ValidatedOptions.error
                    : ValidatedOptions.default
                }
                {...form.register("config.bindDn.0", { required: true })}
              />
            </FormGroup>
            <FormGroup
              label={t("bindCredentials")}
              labelIcon={
                <HelpItem
                  helpText="user-federation-help:bindCredentialsHelp"
                  fieldLabelId="user-federation:bindCredentials"
                />
              }
              fieldId="kc-console-bind-credentials"
              helperTextInvalid={t("validateBindCredentials")}
              validated={
                errors.config?.bindCredential
                  ? ValidatedOptions.error
                  : ValidatedOptions.default
              }
              isRequired
            >
              <PasswordInput
                hasReveal={!edit}
                isRequired
                id="kc-console-bind-credentials"
                data-testid="ldap-bind-credentials"
                validated={
                  errors.config?.bindCredential
                    ? ValidatedOptions.error
                    : ValidatedOptions.default
                }
                {...form.register("config.bindCredential.0", {
                  required: true,
                })}
              />
            </FormGroup>
          </>
        )}
        <FormGroup fieldId="kc-test-auth-button">
          <Button
            variant="secondary"
            id="kc-test-auth-button"
            data-testid="test-auth-button"
            onClick={() => testLdap("testAuthentication")}
          >
            {t("testAuthentication")}
          </Button>
        </FormGroup>
      </FormAccess>
    </>
  );
};
