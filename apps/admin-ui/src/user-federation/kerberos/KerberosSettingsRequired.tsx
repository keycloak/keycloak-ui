import { useState } from "react";
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { UseFormReturn, Controller, useWatch } from "react-hook-form";

import { FormAccess } from "../../components/form-access/FormAccess";
import { useRealm } from "../../context/realm-context/RealmContext";

import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { isEqual } from "lodash-es";
import { WizardSectionHeader } from "../../components/wizard-section-header/WizardSectionHeader";
import { KeycloakTextInput } from "../../components/keycloak-text-input/KeycloakTextInput";
import { useAdminClient, useFetch } from "../../context/auth/AdminClient";

export type KerberosSettingsRequiredProps = {
  form: UseFormReturn<ComponentRepresentation>;
  showSectionHeading?: boolean;
  showSectionDescription?: boolean;
};

export const KerberosSettingsRequired = ({
  form,
  showSectionHeading = false,
  showSectionDescription = false,
}: KerberosSettingsRequiredProps) => {
  const { t } = useTranslation("user-federation");
  const { t: helpText } = useTranslation("user-federation-help");

  const { adminClient } = useAdminClient();
  const { realm } = useRealm();

  const [isEditModeDropdownOpen, setIsEditModeDropdownOpen] = useState(false);

  const allowPassAuth = useWatch({
    control: form.control,
    name: "config.allowPasswordAuthentication",
  });

  useFetch(
    () => adminClient.realms.findOne({ realm }),
    (result) => form.setValue("parentId", result!.id),
    []
  );

  const {
    formState: { errors },
  } = form;

  return (
    <>
      {showSectionHeading && (
        <WizardSectionHeader
          title={t("requiredSettings")}
          description={helpText("kerberosRequiredSettingsDescription")}
          showDescription={showSectionDescription}
        />
      )}

      {/* Required settings */}
      <FormAccess role="manage-realm" isHorizontal>
        <FormGroup
          label={t("consoleDisplayName")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:consoleDisplayNameHelp"
              fieldLabelId="user-federation:consoleDisplayName"
            />
          }
          fieldId="kc-console-display-name"
          isRequired
          validated={errors.name ? "error" : "default"}
          helperTextInvalid={errors.name?.message}
        >
          {/* These hidden fields are required so data object written back matches data retrieved */}
          <KeycloakTextInput
            hidden
            type="text"
            id="kc-console-providerId"
            defaultValue="kerberos"
            aria-label={t("providerId")}
            {...form.register("providerId")}
          />
          <KeycloakTextInput
            hidden
            type="text"
            id="kc-console-providerType"
            defaultValue="org.keycloak.storage.UserStorageProvider"
            aria-label={t("providerType")}
            {...form.register("providerType")}
          />
          <KeycloakTextInput
            hidden
            type="text"
            id="kc-console-parentId"
            defaultValue={realm}
            aria-label={t("parentId")}
            {...form.register("parentId")}
          />

          <KeycloakTextInput
            isRequired
            type="text"
            id="kc-console-name"
            data-testid="kerberos-name"
            validated={errors.name ? "error" : "default"}
            aria-label={t("consoleDisplayName")}
            {...form.register("name", {
              required: {
                value: true,
                message: `${t("validateName")}`,
              },
            })}
          />
        </FormGroup>

        <FormGroup
          label={t("kerberosRealm")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:kerberosRealmHelp"
              fieldLabelId="user-federation:kc-kerberos-realm"
            />
          }
          fieldId="kc-kerberos-realm"
          isRequired
          validated={errors.config?.kerberosRealm ? "error" : "default"}
          helperTextInvalid={
            errors.config?.kerberosRealm ? t("validateRealm") : ""
          }
        >
          <KeycloakTextInput
            isRequired
            type="text"
            id="kc-kerberos-realm"
            data-testid="kerberos-realm"
            aria-label={t("kerberosRealm")}
            validated={errors.config?.kerberosRealm ? "error" : "default"}
            {...form.register("config.kerberosRealm.0", {
              required: true,
            })}
          />
        </FormGroup>

        <FormGroup
          label={t("serverPrincipal")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:serverPrincipalHelp"
              fieldLabelId="user-federation:serverPrincipal"
            />
          }
          fieldId="kc-server-principal"
          isRequired
          validated={errors.config?.serverPrincipal ? "error" : "default"}
          helperTextInvalid={
            errors.config?.serverPrincipal ? t("validateServerPrincipal") : ""
          }
        >
          <KeycloakTextInput
            isRequired
            type="text"
            id="kc-server-principal"
            data-testid="kerberos-principal"
            aria-label={t("kerberosPrincipal")}
            validated={errors.config?.serverPrincipal ? "error" : "default"}
            {...form.register("config.serverPrincipal.0", {
              required: true,
            })}
          />
        </FormGroup>

        <FormGroup
          label={t("keyTab")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:keyTabHelp"
              fieldLabelId="user-federation:keyTab"
            />
          }
          fieldId="kc-key-tab"
          isRequired
          validated={errors.config?.keyTab ? "error" : "default"}
          helperTextInvalid={errors.config?.keyTab ? t("validateKeyTab") : ""}
        >
          <KeycloakTextInput
            isRequired
            type="text"
            id="kc-key-tab"
            aria-label={t("kerberosKeyTab")}
            validated={errors.config?.keyTab ? "error" : "default"}
            {...form.register("config.keyTab.0", {
              required: true,
            })}
          />
        </FormGroup>

        <FormGroup
          label={t("debug")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:debugHelp"
              fieldLabelId="user-federation:debug"
            />
          }
          fieldId="kc-debug"
          hasNoPaddingTop
        >
          {" "}
          <Controller
            name="config.debug"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id={"kc-debug"}
                data-testid="debug"
                onChange={(value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
                aria-label={t("debug")}
              />
            )}
          />
        </FormGroup>

        <FormGroup
          label={t("allowPasswordAuthentication")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:allowPasswordAuthenticationHelp"
              fieldLabelId="user-federation:allowPasswordAuthentication"
            />
          }
          fieldId="kc-allow-password-authentication"
          hasNoPaddingTop
        >
          <Controller
            name="config.allowPasswordAuthentication"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id={"kc-allow-password-authentication"}
                data-testid="allow-password-authentication"
                onChange={(value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
                aria-label={t("allowPasswordAuthentication")}
              />
            )}
          />
        </FormGroup>

        {isEqual(allowPassAuth, ["true"]) ? (
          <FormGroup
            label={t("editMode")}
            labelIcon={
              <HelpItem
                helpText="user-federation-help:editModeKerberosHelp"
                fieldLabelId="user-federation:editMode"
              />
            }
            isRequired
            fieldId="kc-edit-mode"
          >
            {" "}
            <Controller
              name="config.editMode.0"
              defaultValue="READ_ONLY"
              control={form.control}
              rules={{ required: true }}
              render={({ field }) => (
                <Select
                  toggleId="kc-edit-mode"
                  required
                  onToggle={() =>
                    setIsEditModeDropdownOpen(!isEditModeDropdownOpen)
                  }
                  isOpen={isEditModeDropdownOpen}
                  onSelect={(_, value) => {
                    field.onChange(value as string);
                    setIsEditModeDropdownOpen(false);
                  }}
                  selections={field.value}
                  variant={SelectVariant.single}
                >
                  <SelectOption key={0} value="READ_ONLY" isPlaceholder />
                  <SelectOption key={1} value="UNSYNCED" />
                </Select>
              )}
            ></Controller>
          </FormGroup>
        ) : null}

        <FormGroup
          label={t("updateFirstLogin")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:updateFirstLoginHelp"
              fieldLabelId="user-federation:updateFirstLogin"
            />
          }
          fieldId="kc-update-first-login"
          hasNoPaddingTop
        >
          <Controller
            name="config.updateProfileFirstLogin"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id={"kc-update-first-login"}
                data-testid="update-first-login"
                onChange={(value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
                aria-label={t("updateFirstLogin")}
              />
            )}
          />
        </FormGroup>
      </FormAccess>
    </>
  );
};
