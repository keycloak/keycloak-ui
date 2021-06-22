import React, { useState } from "react";
import {
  FileUpload,
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
import { HMACGeneratedForm } from "../hmac-generated/HMACGeneratedForm";

type RSAFormProps = {
  providerType?: string;
  handleModalToggle?: () => void;
  refresh?: () => void;
  save: (component: ComponentRepresentation) => void;
};

export const RSAForm = ({
  providerType,
  save,
}: 
RSAFormProps) => {
  const { t } = useTranslation("groups");
  const serverInfo = useServerInfo();
  const { handleSubmit, control } = useForm({});
  const [isRSAalgDropdownOpen, setIsRSAalgDropdownOpen] = useState(false);
  const [displayName, setDisplayName] = useState("");

  const [keyFileName, setKeyFileName] = useState("");
  const [certificateFileName, setCertificateFileName] = useState("");

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
              forID="kc-algorithm"
            />
          }
        >
          <Controller
            name="algorithm"
            defaultValue=""
            render={({ onChange, value }) => (
              <Select
                toggleId="kc-rsa-algorithm"
                onToggle={() => setIsRSAalgDropdownOpen(!isRSAalgDropdownOpen)}
                onSelect={(_, value) => {
                  onChange(value as string);
                  setIsRSAalgDropdownOpen(false);
                }}
                selections={[value + ""]}
                variant={SelectVariant.single}
                aria-label={t("algorithm")}
                isOpen={isRSAalgDropdownOpen}
                data-testid="select-rsa-algorithm"
              >
                {allComponentTypes[4].properties[3].options!.map((p, idx) => (
                  <SelectOption
                    selected={p === value}
                    key={`rsa-algorithm-${idx}`}
                    value={p}
                  ></SelectOption>
                ))}
              </Select>
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("realm-settings:privateRSAKey")}
          fieldId="kc-private-rsa-key"
          labelIcon={
            <HelpItem
              helpText="realm-settings-help:privateRSAKey"
              forLabel={t("privateRSAKey")}
              forID="kc-rsa-key"
            />
          }
        >
          <Controller
            name="config.privateKey"
            control={control}
            defaultValue={[]}
            render={({ onChange, value }) => (
              <FileUpload
                id="importPrivateKey"
                type="text"
                value={value[0]}
                filenamePlaceholder="Upload a PEM file or paste key below"
                filename={keyFileName}
                onChange={(value, fileName) => {
                  setKeyFileName(fileName);
                  onChange([value]);
                }}
              />
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("realm-settings:x509Certificate")}
          fieldId="kc-aes-keysize"
          labelIcon={
            <HelpItem
              helpText="realm-settings-help:x509Certificate"
              forLabel={t("x509Certificate")}
              forID="kc-x509-certificatw"
            />
          }
        >
          <Controller
            name="config.certificate"
            control={control}
            defaultValue={[]}
            render={({ onChange, value }) => (
              <FileUpload
                id="importCertificate"
                type="text"
                value={value[0]}
                filenamePlaceholder="Upload a PEM file or paste key below"
                filename={certificateFileName}
                onChange={(value, fileName) => {
                  setCertificateFileName(fileName);
                  onChange([value]);
                }}
              />
            )}
          />
        </FormGroup>
      </>
    </Form>
  );
};

export const HMACSettings = () => {

  return (
     <HMACGeneratedForm />
  );


};
