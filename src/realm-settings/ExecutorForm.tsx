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
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { FormAccess } from "../components/form-access/FormAccess";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAlerts } from "../components/alert/Alerts";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { Controller, FormProvider, useForm } from "react-hook-form";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { Link, useHistory, useParams } from "react-router-dom";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import type ComponentTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentTypeRepresentation";
import type { ConfigPropertyRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigInfoRepresentation";
import type ClientProfileRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientProfileRepresentation";
import type { ClientProfileParams } from "./routes/ClientProfile";
import {
  COMPONENTS,
  isValidComponentType,
} from "../client-scopes/add/components/components";
import type { ExecutorParams } from "./routes/Executor";

// type NewExecutor = {
//   helpText: string;
//   label: string;
//   name: string;
//   defaultValue: string;
//   type: string;
// };

const defaultValues = {
  config: {},
  executor: "",
};

export const ExecutorForm = () => {
  const { t } = useTranslation("realm-settings");
  const history = useHistory();
  const { realm, profileName } = useParams<ClientProfileParams>();
  const { executorName } = useParams<ExecutorParams>();
  const { addAlert, addError } = useAlerts();
  const [selectExecutorTypeOpen, setSelectExecutorTypeOpen] = useState(false);
  const serverInfo = useServerInfo();
  const adminClient = useAdminClient();
  const executorTypes =
    serverInfo.componentTypes?.[
      "org.keycloak.services.clientpolicy.executor.ClientPolicyExecutorProvider"
    ];
  const [executors, setExecutors] = useState<ComponentTypeRepresentation[]>([]);
  const [executorProperties, setExecutorProperties] = useState<
    ConfigPropertyRepresentation[]
  >([]);
  const [globalProfiles, setGlobalProfiles] = useState<
    ClientProfileRepresentation[]
  >([]);
  const [profiles, setProfiles] = useState<ClientProfileRepresentation[]>([]);
  const form = useForm({ defaultValues });
  const { control } = form;
  const editMode = executorName ? true : false;

  useFetch(
    () =>
      adminClient.clientPolicies.listProfiles({ includeGlobalProfiles: true }),
    (profiles) => {
      setGlobalProfiles(profiles.globalProfiles ?? []);
      setProfiles(profiles.profiles ?? []);
    },
    []
  );

  const fldNameFormatter = (name: string) =>
    name.toLowerCase().trim().split(/\s+/).join("-");

  const globalProfile = globalProfiles.find(
    (globalProfile) => globalProfile.name === profileName
  );

  const profile = profiles.find((profile) => profile.name === profileName);

  const profileExecutor = profile?.executors?.find(
    (executor) => executor.executor === executorName
  );

  const profileExecutorType = executorTypes?.find(
    (executor) => executor.id === executorName
  );

  const save = async () => {
    const formValues = form.getValues();
    const updatedProfiles = profiles.map((profile) => {
      if (profile.name !== profileName) {
        return profile;
      }

      const executors = (profile.executors ?? []).concat({
        executor: formValues.executor,
        configuration: formValues.config,
      });

      return {
        ...profile,
        executors,
      };
    });
    try {
      await adminClient.clientPolicies.createProfiles({
        profiles: updatedProfiles,
        globalProfiles: globalProfiles,
      });
      addAlert(t("realm-settings:addExecutorSuccess"), AlertVariant.success);
      history.push(`/${realm}/realm-settings/clientPolicies/${profileName}`);
    } catch (error) {
      addError("realm-settings:addExecutorError", error);
    }
  };

  const newProfileExecutors = profileExecutorType?.properties.map(
    (property) => {
      const configs: any = profileExecutor?.configuration;
      let configsArray: any = [];
      if (configs) {
        configsArray = Object.keys(configs).map((key) => ({
          name: String(key),
          value: configs[key],
        }));
      }

      const executorConfig = configsArray?.find(
        (config: any) => config.name === property.name
      );

      return {
        helpText: property.helpText ?? "",
        label: property.label ?? "",
        name: property.name ?? "",
        defaultValue: executorConfig?.value ?? "",
        type: property.type ?? "",
      };
    }
  );

  return (
    <>
      <ViewHeader
        titleKey={editMode ? executorName : t("addExecutor")}
        divider
      />
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          role="manage-realm"
          className="pf-u-mt-lg"
          //isDisabled={globalProfile !== 0}
        >
          <FormGroup
            label={t("executorType")}
            fieldId="kc-executorType"
            labelIcon={
              executors.length > 0 && executors[0].helpText! !== "" ? (
                <HelpItem
                  helpText={executors[0].helpText}
                  forLabel={t("executorTypeHelpText")}
                  forID={t(`common:helpLabel`, {
                    label: t("executorTypeHelpText"),
                  })}
                />
              ) : editMode ? (
                <HelpItem
                  helpText={profileExecutorType?.helpText}
                  forLabel={t("executorTypeHelpText")}
                  forID={t(`common:helpLabel`, {
                    label: t("executorTypeHelpText"),
                  })}
                />
              ) : undefined
            }
          >
            <Controller
              name="executor"
              defaultValue={""}
              control={control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="kc-executor"
                  placeholderText="Select an executor"
                  onToggle={(isOpen) => setSelectExecutorTypeOpen(isOpen)}
                  onSelect={(_, value) => {
                    onChange(value.toString());
                    const selectedExecutor = executorTypes?.filter(
                      (type) => type.id === value
                    );
                    setExecutors(selectedExecutor ?? []);
                    setExecutorProperties(
                      selectedExecutor?.[0].properties ?? []
                    );
                    setSelectExecutorTypeOpen(false);
                  }}
                  selections={editMode ? executorName : value}
                  variant={SelectVariant.single}
                  data-testid="executorType-select"
                  aria-label={t("executorType")}
                  isOpen={selectExecutorTypeOpen}
                  maxHeight={580}
                  isDisabled={editMode}
                >
                  {executorTypes?.map((option) => (
                    <SelectOption
                      selected={option.id === value}
                      key={option.id}
                      value={option.id}
                      description={option.helpText}
                    />
                  ))}
                </Select>
              )}
            />
          </FormGroup>
          <FormProvider {...form}>
            {/* <FormAccess isHorizontal role="manage-realm"> */}
            {executorProperties.map((option) => {
              const componentType = option.type!;
              if (isValidComponentType(componentType)) {
                const Component = COMPONENTS[componentType];
                return (
                  <Component
                    key={option.name}
                    {...option}
                    name={fldNameFormatter(option.label!)}
                    label={option.label}
                  />
                );
              } else {
                console.warn(
                  `There is no editor registered for ${componentType}`
                );
              }
            })}
            {/* </FormAccess> */}
            {/* <FormAccess isHorizontal role="manage-realm" isDisabled> */}
            {editMode &&
              newProfileExecutors?.map((option) => {
                const componentType = option.type!;
                if (isValidComponentType(componentType)) {
                  const Component = COMPONENTS[componentType];
                  return (
                    <Component
                      key={option.name}
                      {...option}
                      name={fldNameFormatter(option.label!)}
                      label={option.label}
                    />
                  );
                } else {
                  console.warn(
                    `There is no editor registered for ${componentType}`
                  );
                }
              })}
            {/* </FormAccess> */}
          </FormProvider>
          {!globalProfile ? (
            <ActionGroup>
              <Button
                variant="primary"
                onClick={save}
                data-testid="realm-settings-add-executor-save-button"
              >
                {editMode ? t("common:save") : t("common:add")}
              </Button>
              <Button
                variant="link"
                component={(props) => (
                  <Link
                    {...props}
                    to={`/${realm}/realm-settings/clientPolicies/${profileName}`}
                  />
                )}
                data-testid="realm-settings-add-executor-cancel-button"
              >
                {t("common:cancel")}
              </Button>
            </ActionGroup>
          ) : undefined}
        </FormAccess>
        {editMode && globalProfile && (
          <div className="kc-backToProfile">
            <Button
              id="backToClientProfile"
              component={(props) => (
                <Link
                  {...props}
                  to={`/${realm}/realm-settings/clientPolicies/${profileName}`}
                ></Link>
              )}
              variant="primary"
              data-testid="backToClientProfile"
            >
              {t("realm-settings:back")}
            </Button>
          </div>
        )}
      </PageSection>
    </>
  );
};
