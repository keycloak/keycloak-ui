import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { useErrorHandler } from "react-error-boundary";
import {
  ActionGroup,
  AlertVariant,
  Button,
  Checkbox,
  FormGroup,
  PageSection,
  Switch,
  TextInput,
} from "@patternfly/react-core";

import RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import { useAdminClient, asyncStateFetch } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";
import { useAlerts } from "../components/alert/Alerts";
import { FormAccess } from "../components/form-access/FormAccess";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { FormPanel } from "../components/scroll-form/FormPanel";

export const RealmSettingsEmailTab = () => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const handleError = useErrorHandler();
  const { realm: realmName } = useRealm();
  const { addAlert } = useAlerts();
  const { register, control, setValue, handleSubmit } = useForm();
  const [realm, setRealm] = useState<RealmRepresentation>();
  const [isAuthenticationEnabled, setAuthenticationEnabled] = useState("");

  const form = useForm();

  useEffect(() => {
    return asyncStateFetch(
      () => adminClient.realms.findOne({ realm: realmName }),
      (realm) => {
        setRealm(realm);
        setupForm(realm);

        setAuthenticationEnabled(realm?.attributes!.authentication);
      },
      handleError
    );
  }, []);

  useEffect(() => {
    setValue("attributes.loginUsername", realm?.attributes!.loginUsername);
    setValue("attributes.loginPassword", realm?.attributes!.loginPassword);
  }, [isAuthenticationEnabled]);

  const setupForm = (realm: RealmRepresentation) => {
    const { ...formValues } = realm;

    form.reset(formValues);

    Object.entries(realm).map((entry) => {
      setValue(entry[0], entry[1]);
    });
  };

  const save = async (realm: RealmRepresentation) => {
    console.log(realm);
    try {
      await adminClient.realms.update({ realm: realmName }, realm);
      setRealm(realm);
      addAlert(t("saveSuccess"), AlertVariant.success);
    } catch (error) {
      addAlert(t("saveError", { error }), AlertVariant.danger);
    }
  };

  return (
    <>
      <PageSection variant="light">
        <FormPanel title={t("template")}>
          <FormAccess
            isHorizontal
            role="manage-realm"
            className="pf-u-mt-lg"
            onSubmit={handleSubmit(save)}
          >
            <FormGroup label={t("from")} fieldId="kc-display-name" isRequired>
              <TextInput
                type="text"
                id="kc-sender-email-address"
                data-testid="sender-email-address"
                name="attributes.from"
                ref={register}
                placeholder="Sender email address"
              />
            </FormGroup>
            <FormGroup
              label={t("fromDisplayName")}
              fieldId="kc-from-display-name"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:userManagedAccess"
                  forLabel={t("authentication")}
                  forID="kc-user-manged-access"
                />
              }
            >
              <TextInput
                type="text"
                id="kc-from-display-name"
                data-testid="from-display-name"
                name="attributes.fromDisplayName"
                ref={register}
                placeholder="Display name for Sender email address"
              />
            </FormGroup>
            <FormGroup label={t("replyTo")} fieldId="kc-reply-to">
              <TextInput
                type="text"
                id="kc-reply-to"
                name="attributes.replyTo"
                ref={register}
                placeholder="Reply to email address"
              />
            </FormGroup>
            <FormGroup
              label={t("replyToDisplayName")}
              fieldId="kc-reply-to-display-name"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:userManagedAccess"
                  forLabel={t("replyToDisplayName")}
                  forID="kc-user-manged-access"
                />
              }
            >
              <TextInput
                type="text"
                id="kc-reply-to-display-name"
                name="attributes.replyToDisplayName"
                ref={register}
                placeholder='Display name for "reply to" email address'
              />
            </FormGroup>
            <FormGroup
              label={t("envelopeFrom")}
              fieldId="kc-envelope-from"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:frontendUrl"
                  forLabel={t("envelopeFrom")}
                  forID="kc-envelope-from"
                />
              }
            >
              <TextInput
                type="text"
                id="kc-frontend-url"
                name="attributes.envelopeFrom"
                ref={register}
                placeholder="Sender envelope email address"
              />
            </FormGroup>
          </FormAccess>
        </FormPanel>
        <FormPanel title={t("connectionAndAuthentication")}>
          <FormAccess
            isHorizontal
            role="manage-realm"
            className="pf-u-mt-lg"
            onSubmit={handleSubmit(save)}
          >
            <FormGroup label={t("host")} fieldId="kc-host" isRequired>
              <TextInput
                type="text"
                id="kc-host"
                name="attributes.host"
                ref={register({ required: true })}
                placeholder="SMTP host"
              />
            </FormGroup>
            <FormGroup label={t("port")} fieldId="kc-port">
              <TextInput
                type="text"
                id="kc-port"
                name="attributes.port"
                ref={register}
                placeholder="SMTP port (defaults to 25)"
              />
            </FormGroup>
            <FormGroup label={t("encryption")} fieldId="kc-html-display-name">
              <Controller
                name="attributes.enableSsl"
                control={control}
                defaultValue="false"
                render={({ onChange, value }) => (
                  <Checkbox
                    id="kc-enable-ssl"
                    data-testid="enable-ssl"
                    name="attributes.enableSsl"
                    label={t("enableSSL")}
                    ref={register}
                    isChecked={value === "true"}
                    onChange={(value) => onChange("" + value)}
                  />
                )}
              />
              <Controller
                name="attributes.enableStartTls"
                control={control}
                defaultValue="false"
                render={({ onChange, value }) => (
                  <Checkbox
                    id="kc-enable-start-tls"
                    data-testid="enable-start-tls"
                    name="attributes.startTls"
                    label={t("enableStartTLS")}
                    ref={register}
                    isChecked={value === "true"}
                    onChange={(value) => onChange("" + value)}
                  />
                )}
              />
            </FormGroup>
            <FormGroup
              hasNoPaddingTop
              label={t("authentication")}
              fieldId="kc-authentication"
            >
              <Controller
                name="attributes.authentication"
                control={control}
                defaultValue="true"
                render={({ onChange, value }) => (
                  <Switch
                    id="kc-authentication"
                    data-testid="email-authentication-switch"
                    label={t("common:enabled")}
                    labelOff={t("common:disabled")}
                    isChecked={value === "true"}
                    onChange={(value) => {
                      onChange("" + value);
                      setAuthenticationEnabled(String(value));
                    }}
                    // onChange={() => {
                    // //   onChange(value);
                    //   onChange(isAuthenticationEnabled);
                    //   if (value == true) {
                    //     // setValue("attributes.authentication", true);
                    //     // setAuthenticationEnabled(value);
                    //   }
                    //   setAuthenticationEnabled(value);
                    // }}
                  />
                )}
              />
            </FormGroup>
            {isAuthenticationEnabled === "true" && (
              <>
                <FormGroup
                  label={t("username")}
                  fieldId="kc-username"
                  isRequired={isAuthenticationEnabled === "true"}
                >
                  <TextInput
                    type="text"
                    id="kc-username"
                    data-testid="username-input"
                    name="attributes.loginUsername"
                    ref={register({ required: true })}
                    placeholder="Login username"
                  />
                </FormGroup>
                <FormGroup
                  label={t("password")}
                  fieldId="kc-username"
                  isRequired={isAuthenticationEnabled === "true"}
                  labelIcon={
                    <HelpItem
                      helpText="realm-settings-help:frontendUrl"
                      forLabel={t("password")}
                      forID="kc-password"
                    />
                  }
                >
                  <TextInput
                    type="password"
                    id="kc-password"
                    data-testid="password-input"
                    name="attributes.loginPassword"
                    ref={register}
                    placeholder="Login password"
                  />
                </FormGroup>
              </>
            )}

            <ActionGroup>
              <Button
                variant="primary"
                type="submit"
                data-testid="email-tab-save"
              >
                {t("common:save")}
              </Button>
              <Button variant="link" onClick={() => setupForm(realm!)}>
                {t("common:revert")}
              </Button>
            </ActionGroup>
          </FormAccess>
        </FormPanel>
      </PageSection>
    </>
  );
};
