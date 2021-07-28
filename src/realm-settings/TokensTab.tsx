import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  ActionGroup,
  AlertVariant,
  Button,
  FormGroup,
  NumberInput,
  PageSection,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  Text,
  TextVariants,
} from "@patternfly/react-core";

import type RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import { FormAccess } from "../components/form-access/FormAccess";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { FormPanel } from "../components/scroll-form/FormPanel";
import { useAdminClient } from "../context/auth/AdminClient";
import { useAlerts } from "../components/alert/Alerts";
import { useRealm } from "../context/realm-context/RealmContext";

import "./RealmSettingsSection.css";
import type UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";
import { TimeSelector } from "../components/time-selector/TimeSelector";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { forHumans } from "../util";

type RealmSettingsSessionsTabProps = {
  realm?: RealmRepresentation;
  user?: UserRepresentation;
};

export const RealmSettingsTokensTab = ({
  realm: initialRealm,
}: RealmSettingsSessionsTabProps) => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const { realm: realmName } = useRealm();
  const { addAlert } = useAlerts();
  const serverInfo = useServerInfo();

  const [realm, setRealm] = useState(initialRealm);
  const [defaultSigAlgDrpdwnIsOpen, setDefaultSigAlgDrpdwnOpen] =
    useState(false);

  const allComponentTypes =
    serverInfo.componentTypes?.["org.keycloak.keys.KeyProvider"] ?? [];

  const esOptions = ["ES256", "ES384", "ES512"];

  const hmacAlgorithmOptions = allComponentTypes[2].properties[4].options;

  const javaKeystoreAlgOptions = allComponentTypes[3].properties[3].options;

  const defaultSigAlgOptions = esOptions.concat(
    hmacAlgorithmOptions!,
    javaKeystoreAlgOptions!
  );

  const {
    control,
    handleSubmit,
    reset: resetForm,
    formState,
  } = useForm<RealmRepresentation>();

  const offlineSessionMaxEnabled = useWatch({
    control,
    name: "offlineSessionMaxLifespanEnabled",
    defaultValue: realm?.offlineSessionMaxLifespanEnabled,
  });

  useEffect(() => resetForm(realm), [realm]);

  const save = async (form: RealmRepresentation) => {
    try {
      console.log(form);
      const savedRealm = { ...realm, ...form };
      await adminClient.realms.update({ realm: realmName }, savedRealm);
      setRealm(savedRealm);
      addAlert(t("saveSuccess"), AlertVariant.success);
    } catch (error) {
      addAlert(
        t("saveError", { error: error.response?.data?.errorMessage || error }),
        AlertVariant.danger
      );
    }
  };

  const reset = () => {
    if (realm) {
      resetForm(realm);
    }
  };

  return (
    <>
      <PageSection variant="light">
        <FormPanel
          title={t("realm-settings:general")}
          className="kc-sso-session-template"
        >
          <FormAccess
            isHorizontal
            role="manage-realm"
            onSubmit={handleSubmit(save)}
          >
            <FormGroup
              label={t("defaultSigAlg")}
              fieldId="kc-default-signature-algorithm"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:defaultSigAlg"
                  forLabel={t("defaultSigAlg")}
                  forID={t("common:helpLabel", { label: t("algorithm") })}
                />
              }
            >
              <Controller
                name="defaultSignatureAlgorithm"
                defaultValue={"RS256"}
                control={control}
                render={({ onChange, value }) => (
                  <Select
                    toggleId="kc-default-sig-alg-"
                    onToggle={() =>
                      setDefaultSigAlgDrpdwnOpen(!defaultSigAlgDrpdwnIsOpen)
                    }
                    onSelect={(_, value) => {
                      onChange(value.toString());
                      setDefaultSigAlgDrpdwnOpen(false);
                    }}
                    selections={[value.toString()]}
                    variant={SelectVariant.single}
                    aria-label={t("defaultSigAlg")}
                    isOpen={defaultSigAlgDrpdwnIsOpen}
                    data-testid="select-default-sig-alg"
                  >
                    {defaultSigAlgOptions!.map((p, idx) => (
                      <SelectOption
                        selected={p === value}
                        key={`default-sig-alg-${idx}`}
                        value={p}
                      ></SelectOption>
                    ))}
                  </Select>
                )}
              />
            </FormGroup>
          </FormAccess>
        </FormPanel>
        <FormPanel
          title={t("realm-settings:refreshTokens")}
          className="kc-client-session-template"
        >
          <FormAccess
            isHorizontal
            role="manage-realm"
            className="pf-u-mt-lg"
            onSubmit={handleSubmit(save)}
          >
            <FormGroup
              hasNoPaddingTop
              label={t("revokeRefreshToken")}
              fieldId="kc-revoke-refresh-token"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:revokeRefreshToken"
                  forLabel={t("revokeRefreshToken")}
                  forID="revokeRefreshToken"
                  id="revokeRefreshToken"
                />
              }
            >
              <Controller
                name="revokeRefreshToken"
                control={control}
                defaultValue={false}
                render={({ onChange, value }) => (
                  <Switch
                    id="kc-revoke-refresh-token"
                    data-testid="revoke-refresh-token-switch"
                    aria-label="revoke-refresh-token-switch"
                    label={t("common:enabled")}
                    labelOff={t("common:disabled")}
                    isChecked={value}
                    onChange={onChange}
                  />
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("refreshTokenMaxReuse")}
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:refreshTokenMaxReuse"
                  forLabel={t("refreshTokenMaxReuse")}
                  forID="refreshTokenMaxReuse"
                />
              }
              fieldId="refreshTokenMaxReuse"
            >
              <Controller
                name="refreshTokenMaxReuse"
                defaultValue={0}
                control={control}
                render={({ onChange, value }) => (
                  <NumberInput
                    type="text"
                    id="refreshTokenMaxReuseMs"
                    value={value}
                    onPlus={() => onChange(value + 1)}
                    onMinus={() => onChange(value - 1)}
                    onChange={(event) =>
                      onChange(Number((event.target as HTMLInputElement).value))
                    }
                  />
                )}
              />
            </FormGroup>
          </FormAccess>
        </FormPanel>
        <FormPanel
          title={t("realm-settings:accessTokens")}
          className="kc-offline-session-template"
        >
          <FormAccess
            isHorizontal
            role="manage-realm"
            className="pf-u-mt-lg"
            onSubmit={handleSubmit(save)}
          >
            <FormGroup
              label={t("accessTokenLifespan")}
              fieldId="accessTokenLifespan"
              helperText={`It is recommended for this value to be shorter than the SSO session idle timeout: ${forHumans(
                realm?.ssoSessionIdleTimeout!
              )}`}
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:accessTokenLifespan"
                  forLabel={t("accessTokenLifespan")}
                  forID="accessTokenLifespan"
                  id="accessTokenLifespan"
                />
              }
            >
              <Controller
                name="accessTokenLifespan"
                defaultValue=""
                helperTextInvalid={t("common:required")}
                control={control}
                render={({ onChange, value }) => (
                  <TimeSelector
                    validated={
                      value > realm?.ssoSessionIdleTimeout!
                        ? "warning"
                        : "default"
                    }
                    className="kc-access-token-lifespan"
                    data-testid="access-token-lifespan"
                    aria-label="access-token-lifespan"
                    value={value}
                    onChange={onChange}
                    units={["minutes", "hours", "days"]}
                  />
                )}
              />
            </FormGroup>

            <FormGroup
              label={t("accessTokenLifespanImplicitFlow")}
              fieldId="accessTokenLifespanImplicitFlow"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:accessTokenLifespanImplicitFlow"
                  forLabel={t("accessTokenLifespanImplicitFlow")}
                  forID="accessTokenLifespanImplicitFlow"
                  id="accessTokenLifespanImplicitFlow"
                />
              }
            >
              <Controller
                name="accessTokenLifespanForImplicitFlow"
                defaultValue=""
                control={control}
                render={({ onChange, value }) => (
                  <TimeSelector
                    className="kc-access-token-lifespan-implicit"
                    data-testid="access-token-lifespan-implicit"
                    aria-label="access-token-lifespan-implicit"
                    value={value}
                    onChange={onChange}
                    units={["minutes", "hours", "days"]}
                  />
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("clientLoginTimeout")}
              fieldId="clientLoginTimeout"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:clientLoginTimeout"
                  forLabel={t("clientLoginTimeout")}
                  forID="clientLoginTimeout"
                  id="clientLoginTimeout"
                />
              }
            >
              <Controller
                name="accessCodeLifespan"
                defaultValue=""
                control={control}
                render={({ onChange, value }) => (
                  <TimeSelector
                    className="kc-client-login-timeout"
                    data-testid="client-login-timeout"
                    aria-label="client-login-timeout"
                    value={value}
                    onChange={onChange}
                    units={["minutes", "hours", "days"]}
                  />
                )}
              />
            </FormGroup>

            {offlineSessionMaxEnabled && (
              <FormGroup
                label={t("offlineSessionMax")}
                fieldId="offlineSessionMax"
                id="offline-session-max-label"
                labelIcon={
                  <HelpItem
                    helpText="realm-settings-help:offlineSessionMax"
                    forLabel={t("offlineSessionMax")}
                    forID="offlineSessionMax"
                    id="offlineSessionMax"
                  />
                }
              >
                <Controller
                  name="offlineSessionMaxLifespan"
                  defaultValue=""
                  control={control}
                  render={({ onChange, value }) => (
                    <TimeSelector
                      className="kc-offline-session-max"
                      data-testid="offline-session-max-input"
                      aria-label="offline-session-max-input"
                      value={value}
                      onChange={onChange}
                      units={["minutes", "hours", "days"]}
                    />
                  )}
                />
              </FormGroup>
            )}
          </FormAccess>
        </FormPanel>
        <FormPanel
          className="kc-login-settings-template"
          title={t("actionTokens")}
        >
          <FormAccess
            isHorizontal
            role="manage-realm"
            className="pf-u-mt-lg"
            onSubmit={handleSubmit(save)}
          >
            <FormGroup
              label={t("userInitiatedActionLifespan")}
              id="kc-user-initiated-action-lifespan"
              fieldId="userInitiatedActionLifespan"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:userInitiatedActionLifespan"
                  forLabel={t("userInitiatedActionLifespan")}
                  forID="userInitiatedActionLifespan"
                  id="userInitiatedActionLifespan"
                />
              }
            >
              <Controller
                name="actionTokenGeneratedByUserLifespan"
                defaultValue={""}
                control={control}
                render={({ onChange, value }) => (
                  <TimeSelector
                    className="kc-login-timeout"
                    data-testid="login-timeout-input"
                    aria-label="login-timeout-input"
                    value={value}
                    onChange={onChange}
                    units={["minutes", "hours", "days"]}
                  />
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("defaultAdminInitiated")}
              fieldId="defaultAdminInitiated"
              id="login-action-timeout-label"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:defaultAdminInitiated"
                  forLabel={t("defaultAdminInitiated")}
                  forID="defaultAdminInitiated"
                  id="defaultAdminInitiated"
                />
              }
            >
              <Controller
                name="actionTokenGeneratedByAdminLifespan"
                defaultValue={""}
                control={control}
                render={({ onChange, value }) => (
                  <TimeSelector
                    className="kc-login-action-timeout"
                    data-testid="login-action-timeout-input"
                    aria-label="login-action-timeout-input"
                    value={value}
                    onChange={onChange}
                    units={["minutes", "hours", "days"]}
                  />
                )}
              />
            </FormGroup>
            <Text
              className="kc-override-action-tokens-subtitle"
              component={TextVariants.h1}
            >
              {t("overrideActionTokens")}
            </Text>
            <FormGroup
              label={t("emailVerification")}
              fieldId="loginActionTimeout"
              id="login-action-timeout-label"
            >
              <Controller
                name="attributes.actionTokenGeneratedByUserLifespan.verify-email"
                defaultValue={
                  realm?.attributes?.actionTokenGeneratedByUserLifespan?.[
                    "verify-email"
                  ]
                }
                control={control}
                render={({ onChange, value }) => (
                  <TimeSelector
                    className="kc-login-action-timeout"
                    data-testid="login-action-timeout-input"
                    aria-label="login-action-timeout-input"
                    value={value}
                    onChange={onChange}
                    units={["minutes", "hours", "days"]}
                  />
                )}
              />
            </FormGroup>
            {/* <FormGroup
              label={t("idpAccountEmailVerification")}
              fieldId="idpAccountEmailVerification"
              id="idp-acct-label"
            >
              <Controller
                name="attributes.actionTokenGeneratedByUserLifespan.idp-verify-account-via-email"
                defaultValue={
                  realm?.attributes?.actionTokenGeneratedByUserLifespan?.[
                    "idp-verify-account-via-email"
                  ]
                }
                control={control}
                render={({ onChange, value }) => (
                  <TimeSelector
                    className="kc-idp-email-verification"
                    data-testid="idp-email-verification-input"
                    aria-label="idp-email-verification"
                    value={value?.toString()}
                    // onChange={(value) => {
                    //   onChange(value?.toString());
                    // }}
                    onChange={onChange}
                    units={["minutes", "hours", "days"]}
                  />
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("forgotPassword")}
              fieldId="forgotPassword"
              id="forgot-password-label"
            >
              <Controller
                name="attributes.actionTokenGeneratedByUserLifespan.reset-credentials']"
                defaultValue={
                  realm?.attributes?.actionTokenGeneratedByUserLifespan?.[
                    "reset-credentials"
                  ]
                }
                control={control}
                render={({ onChange, value }) => (
                  <TimeSelector
                    className="kc-forgot-pw"
                    data-testid="forgot-pw-input"
                    aria-label="forgot-pw-input"
                    value={value / 60}
                    // onChange={(value) => {
                    //   onChange(value?.toString());
                    // }}
                    onChange={onChange}

                    units={["minutes", "hours", "days"]}
                  />
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("executeActions")}
              fieldId="executeActions"
              id="execute-actions"
            >
              <Controller
                name="attributes.actionTokenGeneratedByUserLifespan.execute-actions"
                defaultValue={
                  realm?.attributes?.actionTokenGeneratedByUserLifespan?.[
                    "execute-actions"
                  ]
                }
                control={control}
                render={({ onChange, value }) => (
                  <TimeSelector
                    className="kc-execute-actions"
                    data-testid="execute-actions-time-selector"
                    aria-label="execute-actions-time-selector"
                    value={value / 60}
                    // onChange={(value) => {
                    //   onChange(value?.toString());
                    // }}
                    onChange={onChange}

                    units={["minutes", "hours", "days"]}
                  />
                )}
              />
            </FormGroup> */}
            <ActionGroup>
              <Button
                variant="primary"
                type="submit"
                data-testid="sessions-tab-save"
                isDisabled={!formState.isDirty}
              >
                {t("common:save")}
              </Button>
              <Button variant="link" onClick={reset}>
                {t("common:revert")}
              </Button>
            </ActionGroup>
          </FormAccess>
        </FormPanel>
      </PageSection>
    </>
  );
};
