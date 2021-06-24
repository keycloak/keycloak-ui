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

type Params = {
  name: string;
  id: string;
  providerId: string;
};

export const AESGeneratedSettings = () => {
  const { t } = useTranslation("groups");
  const adminClient = useAdminClient();
  const { id, name } = useParams<Params>();

  const serverInfo = useServerInfo();

  const allComponentTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ];

  const [fetchedProvider, setFetchedProvider] = useState<
    ComponentRepresentation
  >();

  const [
    isEllipticCurveDropdownOpen,
    setIsEllipticCurveDropdownOpen,
  ] = useState(false);

  const form = useForm<ComponentRepresentation>({ mode: "onChange" });

  const setupForm = (component: ComponentRepresentation) => {
    form.reset();
    console.log("uihhhh", component);
    Object.entries(component).map((entry) => {
      // form.setValue(
      //   "config.allowPasswordAuthentication",
      //   component.config?.allowPasswordAuthentication
      // );
      if (entry[0] === "name") {
        console.log("name?", entry[1]);
        form.setValue(entry[0], entry[1]);
      } else if (entry[0] === "config") {
        console.log("???", entry[1].ecdsaEllipticCurveKey);

        form.setValue(
          "config.ecdsaEllipticCurveKey",
          entry[1].ecdsaEllipticCurveKey[0]
        );

        form.setValue("config.enabled", entry[1]);

        form.setValue("config.active", entry[1]);

        // console.log(convertToFormValues(entry[1][0], "config.ecdsaEllipticCurveKey", form.setValue));
      }
      form.setValue(entry[0], entry[1]);
    });
  };

  useFetch(
    async () => {

      if (editMode) return await adminClient.components.findOne({ id: id });
    },
    (result) => {
      if (result) {
        setFetchedProvider(result);
        setupForm(result);
      }
    },
    []
  );

  console.log("hey this is the fetched provider", fetchedProvider);

  return (
    <>
      <>
        <ViewHeader
          titleKey={t("realm-settings:editProvider")}
          subKey={fetchedProvider?.providerId}
        />
        <PageSection variant="light">
          <FormAccess
            isHorizontal
            // onSubmit={handleSubmit(save)}
            role="manage-clients"
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
                form.errors.name
                  ? ValidatedOptions.error
                  : ValidatedOptions.default
              }
              helperTextInvalid={t("common:required")}
            >
              <TextInput
                ref={form.register({ required: true })}
                type="text"
                id="name"
                name="name"
                validated={
                  form.errors.name
                    ? ValidatedOptions.error
                    : ValidatedOptions.default
                }
              />
            </FormGroup>
            <FormGroup
              label={t("common:enabled")}
              labelIcon={
                <HelpItem
                  helpText="client-scopes-help:multiValued"
                  forLabel={t("multiValued")}
                  forID="multiValued"
                />
              }
              fieldId="multiValued"
            >
              <Controller
                name="config.active"
                control={form.control}
                defaultValue={["true"]}
                render={({ onChange, value }) => (
                  <Switch
                    id="multiValued"
                    label={t("common:on")}
                    labelOff={t("common:off")}
                    isChecked={value[0] === "true"}
                    onChange={(value) => onChange([`${value}`])}
                  />
                )}
              />
            </FormGroup>
            <FormGroup
              label={t("realm-settings:active")}
              labelIcon={
                <HelpItem
                  helpText="client-scopes-help:multiValued"
                  forLabel={t("multiValued")}
                  forID="multiValued"
                />
              }
              fieldId="multiValued"
            >
              <Controller
                name="config.active"
                control={form.control}
                defaultValue={["true"]}
                render={({ onChange, value }) => (
                  <Switch
                    id="multiValued"
                    label={t("common:on")}
                    labelOff={t("common:off")}
                    isChecked={value[0] === "true"}
                    onChange={(value) => onChange([`${value}`])}
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
                control={form.control}
                defaultValue={["P-256"]}
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
                    {allComponentTypes[1].properties[3].options!.map(
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

            <ActionGroup>
              <Button variant="primary" type="submit">
                {t("common:save")}
              </Button>
              <Button variant="link">{t("common:cancel")}</Button>
            </ActionGroup>
          </FormAccess>
        </PageSection>
      </>
      {/* <ECDSAGeneratedForm
          form={form}
          providerDetails={fetchedProvider}
          editMode={true}
        /> */}
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
