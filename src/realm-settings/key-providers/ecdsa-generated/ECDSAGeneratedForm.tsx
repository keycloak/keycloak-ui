import React, { Component, useState } from "react";
import {
  ActionGroup,
  Button,
  Checkbox,
  DropdownItem,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  PageSection,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { Controller, useForm, UseFormMethods } from "react-hook-form";
import type ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
import { HelpItem } from "../../../components/help-enabler/HelpItem";
import { useServerInfo } from "../../../context/server-info/ServerInfoProvider";
import { useParams } from "react-router-dom";
import { useAdminClient, useFetch } from "../../../context/auth/AdminClient";
import { convertToFormValues } from "../../../util";
import { FormAccess } from "../../../components/form-access/FormAccess";
import { ViewHeader } from "../../../components/view-header/ViewHeader";

type ECDSAGeneratedFormProps = {
  providerType?: string;
  providerDetails?: ComponentRepresentation;
  // providerDisplayName?: string;
  editMode?: boolean;
  form?: UseFormMethods<ComponentRepresentation>;
  handleModalToggle?: () => void;
  refresh?: () => void;
  save?: (component: ComponentRepresentation) => void;
};

type Params = {
  name: string;
  id: string;
  providerId: string;
};

export const ECDSAGeneratedForm = ({
  providerType,
  providerDetails,
  providerDisplayName,
  form,
  save,
  editMode,
}: ECDSAGeneratedFormProps) => {
  const { t } = useTranslation("groups");
  const serverInfo = useServerInfo();
  const [savedDisplayName, setSavedDisplayName] = useState("");

  console.log("lalala", providerDisplayName);

  const { handleSubmit, control, setValue } = useForm({});

  // console.log("pls", id);
  console.log("key", providerDetails?.config!.ecdsaEllipticCurveKey);

  // const test = async () => {
  //   const name2 = await adminClient.components.findOne({ id: id });
  //   console.log("is this it", name2.name);
  //   setSavedDisplayName(name2.name!);
  // };

  const [
    isEllipticCurveDropdownOpen,
    setIsEllipticCurveDropdownOpen,
  ] = useState(false);

  const [displayName, setDisplayName] = useState("");

  console.log("provider type", providerType);
  console.log("fetched prov", providerDetails);

  const allComponentTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ];

  console.log("beeep", savedDisplayName);
  console.log("wtf", providerDetails?.name);

  return (
    <FormAccess
      role="view-realm"
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
              defaultValue={providerDetails?.name}
              onChange={(value) => {
                onChange(value);
                setDisplayName(value);
              }}
              data-testid="display-name-input"
              // ref={form.register()}
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
          defaultValue={
            !editMode ? ["true"] : providerDetails?.config!.enabled === ["true"]
          }
          render={({ onChange, value }) => (
            <Switch
              id="kc-enabled"
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={value[0] === "true"}
              // data-testid={
              //   !editMode ?
              //   value[0] === "true"
              //     ? "internationalization-enabled"
              //     : "internationalization-disabled"
              //     :

              // }
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
          // defaultValue={editMode ? fetchedProvider?.config!.active : ["true"]}
          render={({ onChange, value }) => (
            <Switch
              id="kc-active"
              label={t("common:on")}
              labelOff={t("common:off")}
              // isChecked={editMode ? fetchedProvider?.config!.active[0] === "true" : value[0] === "true"}
              // data-testid={
              //   value[0] === "true"
              //     ? "internationalization-enabled"
              //     : "internationalization-disabled"
              // }
              onChange={(value) => {
                onChange([value + ""]);
              }}
            />
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("realm-settings:ellipticCurve")}
        fieldId="kc-algorithm"
        labelIcon={
          <HelpItem
            helpText="realm-settings-help:ellipticCurve"
            forLabel={t("emailTheme")}
            forID="kc-email-theme"
          />
        }
      >
        <Controller
          name="config.ecdsaEllipticCurveKey"
          control={control}
          defaultValue={["P-256"]}
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
              aria-label={t("emailTheme")}
              isOpen={isEllipticCurveDropdownOpen}
              placeholderText="Select one..."
              data-testid="select-email-theme"
            >
              {allComponentTypes[1].properties[3].options!.map((p, idx) => (
                <SelectOption
                  selected={p === value}
                  key={`email-theme-${idx}`}
                  value={p}
                ></SelectOption>
              ))}
            </Select>
          )}
        />
      </FormGroup>
    </FormAccess>
  );
};

