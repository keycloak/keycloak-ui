import React, { Component, useState } from "react";
import {
  ActionGroup,
  Button,
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
import { useParams } from "react-router-dom";
import { useAdminClient, useFetch } from "../../../context/auth/AdminClient";
import { convertToFormValues } from "../../../util";

type ECDSAGeneratedFormProps = {
  providerType?: string;
  // providerDisplayName?: string;
  editMode?: boolean;
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
  providerDisplayName,
  save,
  editMode,
}: ECDSAGeneratedFormProps) => {
  const { t } = useTranslation("groups");
  const serverInfo = useServerInfo();
  const adminClient = useAdminClient();
  const [savedDisplayName, setSavedDisplayName] = useState("");
  const [fetchedProvider, setFetchedProvider] = useState<
    ComponentRepresentation
  >();

  console.log("lalala", providerDisplayName);

  const { handleSubmit, control, setValue } = useForm({});
  const { id, name } = useParams<Params>();

  console.log("pls", id);
  console.log("anem", name);

  const test = async () => {
    const name2 = await adminClient.components.findOne({ id: id });
    console.log("is this it", name2.name);
    setSavedDisplayName(name2.name!);
  };

  useFetch(
    async () => {
      // const data = await adminClient.clientScopes.findProtocolMapper({
      //   id,
      //   mapperId,
      // });

      const getComponentById = await adminClient.components.findOne({ id: id });

      if (getComponentById) {
        Object.entries(getComponentById).map((entry) => {
          convertToFormValues(entry[1], "name", setValue);
        });
      }

      return {
        // configProperties: properties,
        name: getComponentById.name,
        config: getComponentById.config,
      };
    },
    (result) => {
      setSavedDisplayName(result.name!);
      setFetchedProvider(result!);
      // setMapping(result.mapping);
    },
    []
  );

  const [
    isEllipticCurveDropdownOpen,
    setIsEllipticCurveDropdownOpen,
  ] = useState(false);

  const [displayName, setDisplayName] = useState("");

  console.log("provider type", providerType);
  console.log("i got faith", fetchedProvider);

  const allComponentTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ];

  console.log("beeep", savedDisplayName);

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
              defaultValue={name}
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
    </Form>
  );
};

export const ECDSASettings = () => {
  const { t } = useTranslation("groups");

  return (
    <>
      <ECDSAGeneratedForm editMode={true} />
      <ActionGroup>
        <Button
          variant="primary"
          //  onClick={save}
          data-testid="realm-roles-save-button"
        >
          {t("common:save")}
        </Button>
      </ActionGroup>
    </>
  );
};
