import React, { useState } from "react";
import {
  ActionGroup,
  AlertVariant,
  Button,
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
import { Controller, useForm } from "react-hook-form";

import type ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
import { HelpItem } from "../../../components/help-enabler/HelpItem";
import { useServerInfo } from "../../../context/server-info/ServerInfoProvider";
import { useAdminClient, useFetch } from "../../../context/auth/AdminClient";
import { useParams, useRouteMatch } from "react-router-dom";
import { FormAccess } from "../../../components/form-access/FormAccess";
import { ViewHeader } from "../../../components/view-header/ViewHeader";
import { convertToFormValues } from "../../../util";
import { useAlerts } from "../../../components/alert/Alerts";
<<<<<<< HEAD
import { useRealm } from "../../../context/realm-context/RealmContext";
=======
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc

type AESGeneratedFormProps = {
  handleModalToggle?: () => void;
  refresh?: () => void;
<<<<<<< HEAD
  save?: (component: ComponentRepresentation) => void;
=======
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
  editMode?: boolean;
  providerType: string;
};

<<<<<<< HEAD
=======
export interface MatchParams {
  providerType: string;
}

>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
export const AESGeneratedForm = ({
  editMode,
  providerType,
  handleModalToggle,
  refresh,
}: AESGeneratedFormProps) => {
<<<<<<< HEAD
  const { t } = useTranslation("groups");
=======
  const { t } = useTranslation("realm-settings");
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
  const serverInfo = useServerInfo();
  const [isKeySizeDropdownOpen, setIsKeySizeDropdownOpen] = useState(false);

  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
<<<<<<< HEAD
  const realm = useRealm();

  const { id } = useParams<{ id: string }>();
  const { url } = useRouteMatch();

  const providerId = url.split("/").slice(-2)[0];
=======

  const { id } = useParams<{ id: string }>();

  const providerId =
    useRouteMatch<MatchParams>("/:providerType?")?.params.providerType;
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc

  const save = async (component: ComponentRepresentation) => {
    try {
      if (id) {
        await adminClient.components.update(
          { id },
          {
            ...component,
<<<<<<< HEAD
            parentId: realm.realm,
            providerId: providerId,
            providerType: "org.keycloak.keys.KeyProvider",
          }
        );
        addAlert(t("realm-settings:saveProviderSuccess"), AlertVariant.success);
      } else {
        await adminClient.components.create({
          ...component,
          parentId: realm.realm,
          providerId: providerType,
          providerType: "org.keycloak.keys.KeyProvider",
        });
        handleModalToggle!();
        addAlert(t("realm-settings:saveProviderSuccess"), AlertVariant.success);
        refresh!();
      }
    } catch (error) {
      addAlert(
        t("realm-settings:saveProviderError") +
          error.response?.data?.errorMessage || error,
=======
            parentId: component.parentId,
            providerId: providerType,
            providerType: "org.keycloak.keys.KeyProvider",
          }
        );
        addAlert(t("saveProviderSuccess"), AlertVariant.success);
      } else {
        await adminClient.components.create({
          ...component,
          parentId: component.parentId,
          providerId: providerType,
          providerType: "org.keycloak.keys.KeyProvider",
        });
        handleModalToggle?.();
        addAlert(t("saveProviderSuccess"), AlertVariant.success);
        refresh?.();
      }
    } catch (error) {
      addAlert(
        t("saveProviderError", {
          error: error.response?.data?.errorMessage || error,
        }),
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
        AlertVariant.danger
      );
    }
  };

  const form = useForm<ComponentRepresentation>({ mode: "onChange" });

  const setupForm = (component: ComponentRepresentation) => {
    form.reset();
<<<<<<< HEAD
    Object.entries(component).forEach((entry) => {
      if (entry[0] === "config") {
        form.setValue("config.secretSize", entry[1].secretSize[0]);

        form.setValue("config.active", entry[1].active[0]);

        convertToFormValues(entry[1], "config", form.setValue);
      }
      form.setValue(entry[0], entry[1]);
=======
    Object.entries(component).map(([key, value]) => {
      if (
        key === "config" &&
        component.config?.secretSize &&
        component.config?.active
      ) {
        form.setValue("config.secretSize", value.secretSize[0]);

        form.setValue("config.active", value.active[0]);

        convertToFormValues(value, "config", form.setValue);
      }
      form.setValue(key, value);
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
    });
  };

  useFetch(
    async () => {
      if (editMode) return await adminClient.components.findOne({ id: id });
    },
    (result) => {
      if (result) {
        setupForm(result);
      }
    },
    []
  );

<<<<<<< HEAD
  const allComponentTypes = serverInfo.componentTypes![
    "org.keycloak.keys.KeyProvider"
  ];
=======
  const allComponentTypes =
    serverInfo.componentTypes?.["org.keycloak.keys.KeyProvider"] ?? [];

  const aesSecretSizeOptions = allComponentTypes[0].properties[3].options;
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc

  return (
    <FormAccess
      isHorizontal
      id="add-provider"
      className="pf-u-mt-lg"
      role="manage-realm"
      onSubmit={form.handleSubmit(save)}
    >
      {editMode && (
        <FormGroup
<<<<<<< HEAD
          label={t("realm-settings:providerId")}
=======
          label={t("providerId")}
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
          labelIcon={
            <HelpItem
              helpText="client-scopes-help:mapperName"
              forLabel={t("common:name")}
              forID="name"
            />
          }
          fieldId="id"
          isRequired
          validated={
            form.errors.name ? ValidatedOptions.error : ValidatedOptions.default
          }
          helperTextInvalid={t("common:required")}
        >
          <TextInput
            ref={form.register()}
            id="id"
            type="text"
            name="id"
            isReadOnly={editMode}
            aria-label={t("consoleDisplayName")}
            defaultValue={id}
            data-testid="display-name-input"
          />
        </FormGroup>
      )}
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
              return (
                <TextInput
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
          <>
            <TextInput
              ref={form.register()}
              type="text"
              id="name"
              name="name"
              defaultValue={providerId}
              validated={
                form.errors.name
                  ? ValidatedOptions.error
                  : ValidatedOptions.default
              }
            />
          </>
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
<<<<<<< HEAD
                onChange([value + ""]);
=======
                onChange([value.toString()]);
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
              }}
            />
          )}
        />
      </FormGroup>
      <FormGroup
<<<<<<< HEAD
        label={t("realm-settings:active")}
=======
        label={t("active")}
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
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
<<<<<<< HEAD
                  onChange([value + ""]);
=======
                  onChange([value.toString()]);
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
                }}
              />
            );
          }}
        />
      </FormGroup>
      <FormGroup
<<<<<<< HEAD
        label={t("realm-settings:AESKeySize")}
=======
        label={t("AESKeySize")}
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
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
<<<<<<< HEAD
                onChange([value + ""]);
                setIsKeySizeDropdownOpen(false);
              }}
              selections={[value + ""]}
=======
                onChange([value.toString()]);
                setIsKeySizeDropdownOpen(false);
              }}
              selections={[value.toString()]}
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
              isOpen={isKeySizeDropdownOpen}
              variant={SelectVariant.single}
              aria-label={t("aesKeySize")}
              data-testid="select-secret-size"
            >
<<<<<<< HEAD
              {allComponentTypes[0].properties[3].options!.map((item, idx) => (
                <SelectOption
                  selected={item === value}
                  key={`email-theme-${idx}`}
=======
              {aesSecretSizeOptions?.map((item) => (
                <SelectOption
                  selected={item === value}
                  key={item}
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
                  value={item}
                />
              ))}
            </Select>
          )}
        />
      </FormGroup>
      <ActionGroup className="kc-AESform-buttons">
        <Button
          className="kc-AESform-save-button"
          data-testid="add-provider-button"
          variant="primary"
          type="submit"
        >
          {t("common:save")}
        </Button>
        <Button
          className="kc-AESform-cancel-button"
<<<<<<< HEAD
          onClick={!editMode ? () => handleModalToggle!() : () => {}}
=======
          onClick={(!editMode && handleModalToggle) || undefined}
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
          variant="link"
        >
          {t("common:cancel")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};

export const AESGeneratedSettings = () => {
<<<<<<< HEAD
  const { t } = useTranslation("groups");
  const { url } = useRouteMatch();
  const providerId = url.split("/").slice(-2)[0];

  return (
    <>
      <ViewHeader
        titleKey={t("realm-settings:editProvider")}
        subKey={providerId}
      />
      <PageSection variant="light">
        <FormAccess isHorizontal role="manage-clients">
          <AESGeneratedForm providerType={providerId} editMode={true} />
        </FormAccess>
=======
  const { t } = useTranslation("realm-settings");
  const providerId = useRouteMatch<MatchParams>(
    "/:realm/realm-settings/keys/:id?/:providerType?/settings"
  )?.params.providerType;
  return (
    <>
      <ViewHeader titleKey={t("editProvider")} subKey={providerId} />
      <PageSection variant="light">
        <AESGeneratedForm providerType={providerId!} editMode />
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
      </PageSection>
    </>
  );
};
