import React, { useState } from "react";
import {
  ActionGroup,
  AlertVariant,
  Button,
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
import { useAdminClient, useFetch } from "../../../context/auth/AdminClient";
import { useParams } from "react-router-dom";
import { FormAccess } from "../../../components/form-access/FormAccess";
import { ViewHeader } from "../../../components/view-header/ViewHeader";
import { convertToFormValues } from "../../../util";
import { useAlerts } from "../../../components/alert/Alerts";
import { useRealm } from "../../../context/realm-context/RealmContext";

type Params = {
  name: string;
  id: string;
  providerId: string;
};

type AESGeneratedFormProps = {
  providerType?: string;
  handleModalToggle?: () => void;
  refresh?: () => void;
  save?: (component: ComponentRepresentation) => void;
  form?: UseFormMethods<ComponentRepresentation>;
  editMode?: boolean;
  displayName?: string;
  onNameUpdate?: (name: string | undefined) => void | undefined;
};

export const AESGeneratedForm = ({
  providerType,
  save,
  editMode,
  onNameUpdate,
  displayName,
  params,
}: // save,
AESGeneratedFormProps) => {
  const { t } = useTranslation("groups");
  const serverInfo = useServerInfo();
  // const { handleSubmit } = useForm({});
  const [isKeySizeDropdownOpen, setIsKeySizeDropdownOpen] = useState(false);
  // const [displayName, setDisplayName] = useState("");
  const [fetchedProvider, setFetchedProvider] = useState<
    ComponentRepresentation
  >();
  const adminClient = useAdminClient();

  const { id } = useParams<Params>();

  const form = useForm<ComponentRepresentation>({ mode: "onChange" });

  console.log("??edit mode", editMode);

  const setupForm = (component: ComponentRepresentation) => {
    console.log("component", component);
    form.reset();
    Object.entries(component).forEach((entry) => {
      // form.setValue(
      //   "config.allowPasswordAuthentication",
      //   component.config?.allowPasswordAuthentication
      // );
      if (entry[0] === "config") {
        console.log("???", entry[1].secretSize);

        form.setValue("config.secretSize", entry[1].secretSize[0]);

        form.setValue("config.active", entry[1].active[0]);

        convertToFormValues(entry[1], "config", form.setValue);

        // console.log(convertToFormValues(entry[1][0], "config.ecdsaEllipticCurveKey", form.setValue));
      }
      form.setValue(entry[0], entry[1]);
    });
  };

  console.log("provider", providerType);

  useFetch(
    async () => {
      if (editMode) return await adminClient.components.findOne({ id: id });
    },
    (result) => {
      console.log(`----------- RESULT -----------`);
      console.dir(result);
      if (result) {
        setupForm(result);
        setFetchedProvider(result);
      }
    },
    []
  );

  const allComponentTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ];

  console.log(":D", fetchedProvider);
  return (
    <FormAccess
      isHorizontal
      id="add-provider"
      className="pf-u-mt-lg"
      role="manage-realm"
      onSubmit={form.handleSubmit(save!)}
    >
      <FormGroup
        label={t("common:name")}
        labelIcon={
          <HelpItem
            helpText="client-scopes-help:mapperName"
            forLabel={t("common:name")}
            forID="name"
          />
        }
        fieldId="name"
        isRequired
        validated={
          form.errors.name ? ValidatedOptions.error : ValidatedOptions.default
        }
        helperTextInvalid={t("common:required")}
      >
        {!editMode && (
          <Controller
            name="name"
            control={form.control}
            defaultValue={providerType}
            render={({ onChange, value }) => {
              console.log(`======= Value: ${value} ========`);
              return (
                <TextInput
                  ref={form.register()}
                  id="name"
                  type="text"
                  aria-label={t("consoleDisplayName")}
                  defaultValue={providerType}
                  value={value}
                  onChange={(value) => onChange(value)}
                  data-testid="display-name-input"
                />
              );
            }}
          />
        )}
        {editMode && (
          <Controller
            name="name"
            control={form.control}
            defaultValue={providerType}
            render={({ onChange }) => {
              return (
                <TextInput
                  ref={form.register({ required: true })}
                  type="text"
                  id="name"
                  name="name"
                  // onChange={(value) => params.setDisplayName!(value)}
                  onChange={(value) => onChange(value)}
                  // onChange={(value) => {
                  //   onChange([value + ""]);
                  // }}
                  defaultValue={providerType}
                  validated={
                    form.errors.name
                      ? ValidatedOptions.error
                      : ValidatedOptions.default
                  }
                />
              );
            }}
          />
        )}
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
          control={form.control}
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
          control={form.control}
          defaultValue={["true"]}
          render={({ onChange, value }) => {
            console.log(`======= Switch Value: ${value}`);
            return (
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
            );
          }}
        />
      </FormGroup>
      <FormGroup
        label={t("realm-settings:AESKeySize")}
        fieldId="kc-aes-keysize"
        labelIcon={
          <HelpItem
            helpText="realm-settings-help:AESKeySize"
            forLabel={t("AESKeySize")}
            forID="kc-aes-key-size"
          />
        }
      >
        <Controller
          name="config.secretSize"
          control={form.control}
          defaultValue={["16"]}
          render={({ onChange, value }) => (
            <Select
              toggleId="kc-aes-keysize"
              onToggle={() => setIsKeySizeDropdownOpen(!isKeySizeDropdownOpen)}
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
              {allComponentTypes[0].properties[3].options!.map((item, idx) => (
                <SelectOption
                  selected={item === value}
                  key={`email-theme-${idx}`}
                  value={item}
                />
              ))}
            </Select>
          )}
        />
      </FormGroup>
    </FormAccess>
  );
};

export const AESGeneratedSettings = () => {

  const {id, providerId} = useParams<{id: string, providerId: string}>();
  const form = useForm<ComponentRepresentation>({ mode: "onChange" });

  console.log("vals", form.getValues())
  
  const { t } = useTranslation("groups");
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  
  const update = async (component: ComponentRepresentation) => {
    console.log("WAT", component)
    try {
      console.log(`========== SAVE ==========`);
      console.dir(component);
      await adminClient.components.update({ id }, component);
      // refresh!();
      addAlert(t("realm-settings:saveProviderSuccess"), AlertVariant.success);
    } catch (error) {
      addAlert(
        t("realm-settings:saveProviderError") +
          error.response?.data?.errorMessage || error,
        AlertVariant.danger
      );
    }
  };

  return (
    <>
      <ViewHeader
        titleKey={t("realm-settings:editProvider")}
        subKey={providerId}
      />
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          onSubmit={form.handleSubmit(() => update(form.getValues()))}
          role="manage-clients"
        >
          <AESGeneratedForm editMode={true} />
          <ActionGroup>
            <Button variant="primary" type="submit">
              {t("common:save")}
            </Button>
            <Button variant="link">{t("common:cancel")}</Button>
          </ActionGroup>
        </FormAccess>
      </PageSection>
    </>
  );
};
