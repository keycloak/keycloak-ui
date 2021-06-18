import React, { useState } from "react";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

import { useAdminClient } from "../context/auth/AdminClient";
import { useAlerts } from "../components/alert/Alerts";
import type ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { useRealm } from "../context/realm-context/RealmContext";

type JavaKeystoreFormProps = {
  providerType?: string;
  handleModalToggle?: () => void;
  refresh?: () => void;
  save: (component: ComponentRepresentation) => void;
};

export const JavaKeystoreForm = ({
  providerType,
  handleModalToggle,
  save,
  refresh,
}: JavaKeystoreFormProps) => {
  const { t } = useTranslation("groups");
  const serverInfo = useServerInfo();
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  const { handleSubmit, control } = useForm({});
  const [
    isEllipticCurveDropdownOpen,
    setIsEllipticCurveDropdownOpen,
  ] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const realm = useRealm();

  const allComponentTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ];

  return (
    <Form
      isHorizontal
      id="add-provider"
      className="pf-u-mt-lg"
      onSubmit={handleSubmit(save!)}
    >
      <FormGroup
        label={t("realm-settings:consoleDisplayName")}
        fieldId="kc-console-display-name"
        labelIcon={
          <HelpItem
            helpText="realm-settings-help:displayName"
            forLabel={t("loginTheme")}
            forID="kc-console-display-name"
          />
        }
      >
        <Controller
          name="name"
          control={control}
          defaultValue={providerType}
          render={({ onChange }) => (
            <TextInput
              aria-label={t("consoleDisplayName")}
              defaultValue={providerType}
              onChange={(value) => {
                onChange(value);
                setDisplayName(value);
              }}
              data-testid="display-name-input"
            ></TextInput>
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("common:enabled")}
        fieldId="kc-enabled"
        labelIcon={
          <HelpItem
            helpText={t("realm-settings-help:enabled")}
            forLabel={t("enabled")}
            forID="kc-enabled"
          />
        }
      >
        <Controller
          name="config.enabled"
          control={control}
          defaultValue={["true"]}
          render={({ onChange, value }) => (
            <Switch
              id="kc-enabled"
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={value[0] === "true"}
              data-testid={
                value[0] === "true"
                  ? "internationalization-enabled"
                  : "internationalization-disabled"
              }
              onChange={(value) => {
                onChange([value + ""]);
              }}
            />
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("realm-settings:active")}
        fieldId="kc-active"
        labelIcon={
          <HelpItem
            helpText="realm-settings-help:active"
            forLabel={t("active")}
            forID="kc-active"
          />
        }
      >
        <Controller
          name="config.active"
          control={control}
          defaultValue={["true"]}
          render={({ onChange, value }) => (
            <Switch
              id="kc-active"
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={value[0] === "true"}
              data-testid={
                value[0] === "true"
                  ? "internationalization-enabled"
                  : "internationalization-disabled"
              }
              onChange={(value) => {
                onChange([value + ""]);
              }}
            />
          )}
        />
      </FormGroup>
      <>
        <FormGroup
          label={t("realm-settings:algorithm")}
          fieldId="kc-algorithm"
          labelIcon={
            <HelpItem
              helpText="realm-settings-help:algorithm"
              forLabel={t("algorithm")}
              forID="kc-email-theme"
            />
          }
        >
          <Controller
            name="config.algorithm"
            control={control}
            defaultValue={["RS256"]}
            render={({ onChange, value }) => (
              <Select
                toggleId="kc-elliptic"
                onToggle={() =>
                  setIsEllipticCurveDropdownOpen(!isEllipticCurveDropdownOpen)
                }
                onSelect={(_, value) => {
                  onChange([value + ""]);
                  setIsEllipticCurveDropdownOpen(false);
                }}
                selections={[value + ""]}
                variant={SelectVariant.single}
                aria-label={t("algorithm")}
                isOpen={isEllipticCurveDropdownOpen}
                placeholderText="Select one..."
                data-testid="select-algorithm"
              >
                {allComponentTypes[3].properties[3].options!.map((p, idx) => (
                  <SelectOption
                    selected={p === value}
                    key={`algorithm-${idx}`}
                    value={p}
                  ></SelectOption>
                ))}
              </Select>
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("realm-settings:keystore")}
          fieldId="kc-login-theme"
          labelIcon={
            <HelpItem
              helpText="realm-settings-help:keystore"
              forLabel={t("keystore")}
              forID="kc-keystore"
            />
          }
        >
          <Controller
            name="config.keystore"
            control={control}
            defaultValue={[]}
            render={({ onChange }) => (
              <TextInput
                aria-label={t("keystore")}
                onChange={(value) => {
                  onChange([value + ""]);
                }}
                data-testid="select-display-name"
              ></TextInput>
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("realm-settings:keystorePassword")}
          fieldId="kc-login-theme"
          labelIcon={
            <HelpItem
              helpText="realm-settings-help:keystorePassword"
              forLabel={t("keystorePassword")}
              forID="kc-keystore-password"
            />
          }
        >
          <Controller
            name="config.keystorePassword"
            control={control}
            defaultValue={[]}
            render={({ onChange }) => (
              <TextInput
                aria-label={t("keystorePassword")}
                onChange={(value) => {
                  onChange([value + ""]);
                  setDisplayName(value);
                }}
                data-testid="keystore-password"
              ></TextInput>
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("realm-settings:keyAlias")}
          fieldId="kc-login-theme"
          labelIcon={
            <HelpItem
              helpText="realm-settings-help:keyAlias"
              forLabel={t("keyAlias")}
              forID="kc-key-alias"
            />
          }
        >
          <Controller
            name="config.keyAlias"
            control={control}
            defaultValue={[]}
            render={({ onChange }) => (
              <TextInput
                aria-label={t("keyAlias")}
                onChange={(value) => {
                  onChange([value + ""]);
                }}
                data-testid="key-alias"
              ></TextInput>
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("realm-settings:keyPassword")}
          fieldId="kc-login-theme"
          labelIcon={
            <HelpItem
              helpText="realm-settings-help:keyPassword"
              forLabel={t("keyPassword")}
              forID="kc-key-password"
            />
          }
        >
          <Controller
            name="config.keyPassword"
            control={control}
            defaultValue={[]}
            render={({ onChange }) => (
              <TextInput
                aria-label={t("keyPassword")}
                onChange={(value) => {
                  onChange([value + ""]);
                  setDisplayName(value);
                }}
                data-testid="key-password"
              ></TextInput>
            )}
          />
        </FormGroup>
      </>
    </Form>
  );
};
