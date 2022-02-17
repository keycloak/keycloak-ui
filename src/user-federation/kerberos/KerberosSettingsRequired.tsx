import React, { useState } from "react";
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { UseFormMethods, Controller, useWatch } from "react-hook-form";

import { FormAccess } from "../../components/form-access/FormAccess";
import { useRealm } from "../../context/realm-context/RealmContext";

import { HelpItem } from "../../components/help-enabler/HelpItem";
import { isEqual } from "lodash-es";
import { WizardSectionHeader } from "../../components/wizard-section-header/WizardSectionHeader";
import { useAdminClient, useFetch } from "../../context/auth/AdminClient";

export type KerberosSettingsRequiredProps = {
  form: UseFormMethods;
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

  const adminClient = useAdminClient();
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
        >
          {/* These hidden fields are required so data object written back matches data retrieved */}
          <TextInput
            hidden
            type="text"
            id="kc-console-providerId"
            name="providerId"
            defaultValue="kerberos"
            ref={form.register}
          />
          <TextInput
            hidden
            type="text"
            id="kc-console-providerType"
            name="providerType"
            defaultValue="org.keycloak.storage.UserStorageProvider"
            ref={form.register}
          />
          <TextInput
            hidden
            type="text"
            id="kc-console-parentId"
            name="parentId"
            defaultValue={realm}
            ref={form.register}
          />

          <TextInput
            isRequired
            type="text"
            id="kc-console-name"
            name="name"
            ref={form.register({
              required: {
                value: true,
                message: `${t("validateName")}`,
              },
            })}
            data-testid="kerberos-name"
          />
          {form.errors.name && (
            <div className="error">{form.errors.name.message}</div>
          )}
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
        >
          <TextInput
            isRequired
            type="text"
            id="kc-kerberos-realm"
            name="config.kerberosRealm[0]"
            ref={form.register({
              required: {
                value: true,
                message: `${t("validateRealm")}`,
              },
            })}
            data-testid="kerberos-realm"
          />
          {form.errors.config?.kerberosRealm?.[0] && (
            <div className="error">
              {form.errors.config.kerberosRealm[0].message}
            </div>
          )}
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
        >
          <TextInput
            isRequired
            type="text"
            id="kc-server-principal"
            name="config.serverPrincipal[0]"
            ref={form.register({
              required: {
                value: true,
                message: `${t("validateServerPrincipal")}`,
              },
            })}
            data-testid="kerberos-principal"
          />
          {form.errors.config?.serverPrincipal?.[0] && (
            <div className="error">
              {form.errors.config.serverPrincipal[0].message}
            </div>
          )}
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
        >
          <TextInput
            isRequired
            type="text"
            id="kc-key-tab"
            name="config.keyTab[0]"
            ref={form.register({
              required: {
                value: true,
                message: `${t("validateKeyTab")}`,
              },
            })}
            data-testid="kerberos-keytab"
          />
          {form.errors.config?.keyTab?.[0] && (
            <div className="error">{form.errors.config.keyTab[0].message}</div>
          )}
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
            render={({ onChange, value }) => (
              <Switch
                id={"kc-debug"}
                onChange={(value) => onChange([`${value}`])}
                isChecked={value?.[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
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
            render={({ onChange, value }) => (
              <Switch
                id={"kc-allow-password-authentication"}
                onChange={(value) => onChange([`${value}`])}
                isChecked={value?.[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
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
              name="config.editMode[0]"
              defaultValue="READ_ONLY"
              control={form.control}
              rules={{ required: true }}
              render={({ onChange, value }) => (
                <Select
                  toggleId="kc-edit-mode"
                  required
                  onToggle={() =>
                    setIsEditModeDropdownOpen(!isEditModeDropdownOpen)
                  }
                  isOpen={isEditModeDropdownOpen}
                  onSelect={(_, value) => {
                    onChange(value as string);
                    setIsEditModeDropdownOpen(false);
                  }}
                  selections={value}
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
            render={({ onChange, value }) => (
              <Switch
                id={"kc-update-first-login"}
                onChange={(value) => onChange([`${value}`])}
                isChecked={value?.[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
              />
            )}
          />
        </FormGroup>
      </FormAccess>
    </>
  );
};
