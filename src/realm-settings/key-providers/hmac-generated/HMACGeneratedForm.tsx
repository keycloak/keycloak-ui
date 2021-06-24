import React, { useState } from "react";
import {
  Form,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

import type ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
import { HelpItem } from "../../../components/help-enabler/HelpItem";
import { useServerInfo } from "../../../context/server-info/ServerInfoProvider";

type HMACGeneratedFormProps = {
  providerType?: string;
  handleModalToggle?: () => void;
  refresh?: () => void;
  save?: (component: ComponentRepresentation) => void;
//   open: boolean;
};

export const HMACGeneratedForm = ({
  providerType,
  save,

}: // save,
HMACGeneratedFormProps) => {
  const { t } = useTranslation("groups");
  const serverInfo = useServerInfo();
  const { handleSubmit, control } = useForm({});
  const [isKeySizeDropdownOpen, setIsKeySizeDropdownOpen] = useState(false);
  const [
    isEllipticCurveDropdownOpen,
    setIsEllipticCurveDropdownOpen,
  ] = useState(false);
  // const [displayName, setDisplayName] = useState("");

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
                  // setDisplayName(value);
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
        {/* {providerType === "hmac-generated" && ( */}
          <>
            <FormGroup
              label={t("realm-settings:secretSize")}
              fieldId="kc-aes-keysize"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:secretSize"
                  forLabel={t("emailTheme")}
                  forID="kc-email-theme"
                />
              }
            >
              <Controller
                name="config.secretSize"
                control={control}
                defaultValue={["64"]}
                render={({ onChange, value }) => (
                  <Select
                    toggleId="kc-aes-keysize"
                    onToggle={() =>
                      setIsKeySizeDropdownOpen(!isKeySizeDropdownOpen)
                    }
                    onSelect={(_, value) => {
                      onChange([value + ""]);
                      setIsKeySizeDropdownOpen(false);
                    }}
                    selections={[value + ""]}
                    isOpen={isKeySizeDropdownOpen}
                    variant={SelectVariant.single}
                    aria-label={t("aesKeySize")}
                    data-testid="select-secret-size"
                  >
                    {allComponentTypes[2].properties[3].options!.map(
                      (item, idx) => (
                        <SelectOption
                          selected={item === value}
                          key={`email-theme-${idx}`}
                          value={item}
                        />
                      )
                    )}
                  </Select>
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("realm-settings:algorithm")}
              fieldId="kc-algorithm"
              labelIcon={
                <HelpItem
                  helpText="realm-settings-help:algorithm"
                  forLabel={t("algorithm")}
                  forID="kc-algorithm"
                />
              }
            >
              <Controller
                name="config.algorithm"
                control={control}
                defaultValue={["HS-256"]}
                render={({ onChange, value }) => (
                  <Select
                    toggleId="kc-elliptic"
                    onToggle={() =>
                      setIsEllipticCurveDropdownOpen(
                        !isEllipticCurveDropdownOpen
                      )
                    }
                    onSelect={(_, value) => {
                      onChange([value + ""]);
                      setIsEllipticCurveDropdownOpen(false);
                    }}
                    selections={[value + ""]}
                    variant={SelectVariant.single}
                    aria-label={t("emailTheme")}
                    isOpen={isEllipticCurveDropdownOpen}
                    placeholderText="Select one..."
                    data-testid="select-email-theme"
                  >
                    {allComponentTypes[2].properties[4].options!.map(
                      (p, idx) => (
                        <SelectOption
                          selected={p === value}
                          key={`email-theme-${idx}`}
                          value={p}
                        ></SelectOption>
                      )
                    )}
                  </Select>
                )}
              />
            </FormGroup>
          </>
        {/* )} */}
      </Form>
  );
};

export const HMACGeneratedSettings = () => {

  return (
     <HMACGeneratedForm />
  );


};
