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
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { FormAccess } from "../components/form-access/FormAccess";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAlerts } from "../components/alert/Alerts";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { Controller, useForm } from "react-hook-form";
import type ComponentTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentTypeRepresentation";
import type { ConfigPropertyRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigInfoRepresentation";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { Link, useParams } from "react-router-dom";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import type ClientProfileRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientProfileRepresentation";

export const ExecutorForm = () => {
  const { t } = useTranslation("realm-settings");
  const { realm, profileName } =
    useParams<{ realm: string; profileName: string }>();
  const { addAlert, addError } = useAlerts();
  const [selectExecutorTypeOpen, setSelectExecutorTypeOpen] = useState(false);
  const [selectAlgorithmTypeOpen, setSelectAlgorithmTypeOpen] = useState(false);
  const [selectMultiAuthenticatorOpen, setSelectMultiAuthenticatorOpen] =
    useState(false);
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

  const { control, getValues, register } = useForm();

  useFetch(
    () =>
      adminClient.clientPolicies.listProfiles({ includeGlobalProfiles: true }),
    (profiles) => {
      setGlobalProfiles(profiles.globalProfiles ?? []);
      setProfiles(profiles.profiles ?? []);
    },
    []
  );

  const fldNameFormatter = (name: string) => {
    return name.toLowerCase().trim().split(/\s+/).join("-");
  };

  const save = async () => {
    const form = getValues();

    const createdExecutors = {
      executor: form.executor,
      configuration: { ...form },
    };

    console.log(createdExecutors);

    const updatedProfile = {
      executors: [createdExecutors],
    };

    // console.log(createdExecutor);

    // const allProfiles = profiles.concat(createdProfile);

    // try {
    //   await adminClient.clientPolicies.createProfiles({
    //     profiles: allProfiles,
    //     globalProfiles: globalProfiles,
    //   });
    //   addAlert(t("realm-settings:addExecutorSuccess"), AlertVariant.success);
    // } catch (error) {
    //   addError("realm-settings:addExecutorError", error);
    // }
  };

  return (
    <>
      <ViewHeader titleKey={t("addExecutor")} divider />
      <PageSection variant="light">
        <FormAccess isHorizontal role="manage-realm" className="pf-u-mt-lg">
          <FormGroup
            label={t("executorType")}
            fieldId="kc-executorType"
            labelIcon={
              executors.length > 0 && executors[0].helpText !== "" ? (
                <HelpItem
                  helpText={executors.length > 0 && executors[0].helpText}
                  forLabel={t("executorTypeHelpText")}
                  forID={t(`common:helpLabel`, {
                    label: t("executorTypeHelpText"),
                  })}
                />
              ) : (
                <> </>
              )
            }
          >
            <Controller
              name="executor"
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
                  selections={value}
                  variant={SelectVariant.single}
                  data-testid="executorType-select"
                  aria-label={t("executorType")}
                  isOpen={selectExecutorTypeOpen}
                  maxHeight={580}
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
          {executorProperties.length > 0 &&
            executorProperties.map((option) => {
              return (
                option.type === "boolean" && (
                  <FormGroup
                    key="kc-executorType"
                    label={option.label}
                    fieldId="kc-executorTypeSwitch"
                    labelIcon={
                      <HelpItem
                        helpText={option.helpText}
                        forLabel={t("executorTypeSwitchHelpText")}
                        forID={t(`common:helpLabel`, {
                          label: t("executorTypeSwitchHelpText"),
                        })}
                      />
                    }
                  >
                    <Controller
                      name={fldNameFormatter(option.label!)}
                      control={control}
                      defaultValue={{}}
                      render={({ onChange, value }) => (
                        <Switch
                          id="kc-executorType-switch"
                          data-testid="executorType-switch"
                          label={t("executorTypeSwitch: On")}
                          labelOff={t("executorTypeSwitch: Off")}
                          isChecked={value === "true"}
                          onChange={(value) => {
                            onChange("" + value);
                          }}
                        />
                      )}
                    />
                  </FormGroup>
                )
              );
            })}
          {executorProperties.length > 0 &&
            executorProperties.map((option) => {
              return (
                option.type === "String" && (
                  <FormGroup
                    label={option.label}
                    fieldId="kc-executorTypeText"
                    labelIcon={
                      <HelpItem
                        helpText={option.helpText}
                        forLabel={t("executorTypeTextHelpText")}
                        forID={t(`common:helpLabel`, {
                          label: t("executorTypeTextHelpText"),
                        })}
                      />
                    }
                  >
                    <TextInput
                      name={fldNameFormatter(option.label!)}
                      ref={register()}
                      type="text"
                      id="kc-executorType-text"
                      defaultValue={option.defaultValue}
                      data-testid="executorType-text"
                    />
                  </FormGroup>
                )
              );
            })}
          {executorProperties.length > 0 &&
            executorProperties.map((option) => {
              return (
                option.type === "List" && (
                  <FormGroup
                    label={option.label}
                    fieldId="kc-executorTypeSelect"
                    labelIcon={
                      <HelpItem
                        helpText={option.helpText}
                        forLabel={t("executorTypeSelectHelpText")}
                        forID={t(`common:helpLabel`, {
                          label: t("executorTypeSelectHelpText"),
                        })}
                      />
                    }
                  >
                    <Controller
                      name={fldNameFormatter(option.label!)}
                      control={control}
                      render={({ onChange, value }) => (
                        <Select
                          toggleId="kc-executorTypeSelect"
                          onToggle={(isOpen) =>
                            setSelectAlgorithmTypeOpen(isOpen)
                          }
                          onSelect={(_, value) => {
                            onChange(value.toString());
                            option.options?.filter(
                              (option) => option === value
                            );
                            setSelectAlgorithmTypeOpen(false);
                          }}
                          selections={value}
                          variant={SelectVariant.single}
                          aria-label={t("executorTypeSelectAlgorithm")}
                          isOpen={selectAlgorithmTypeOpen}
                          maxHeight={300}
                          defaultValue={option.defaultValue}
                        >
                          {option.options?.map((option) => (
                            <SelectOption
                              selected={option === value}
                              key={option}
                              value={option}
                            />
                          ))}
                        </Select>
                      )}
                    />
                  </FormGroup>
                )
              );
            })}
          {executorProperties.length > 0 &&
            executorProperties.map((option) => {
              return (
                option.type === "MultivaluedList" && (
                  <FormGroup
                    label={option.label}
                    fieldId="kc-executorAuthenticatorMultiSelect"
                    labelIcon={
                      <HelpItem
                        helpText={option.helpText}
                        forLabel={t("executorAuthenticatorMultiSelectHelpText")}
                        forID={t(`common:helpLabel`, {
                          label: t("executorAuthenticatorMultiSelectHelpText"),
                        })}
                      />
                    }
                  >
                    <Controller
                      name={fldNameFormatter(option.label!)}
                      control={control}
                      render={({ onChange, value }) => (
                        <Select
                          name="executorClientAuthenticator"
                          data-testid="executorClientAuthenticator-multiSelect"
                          chipGroupProps={{
                            numChips: 1,
                            expandedText: "Hide",
                            collapsedText: "Show ${remaining}",
                          }}
                          variant={SelectVariant.typeaheadMulti}
                          typeAheadAriaLabel="Select"
                          onToggle={(isOpen) =>
                            setSelectMultiAuthenticatorOpen(isOpen)
                          }
                          selections={value}
                          onSelect={(_, v) => {
                            const option = v as string;
                            if (!value) {
                              onChange([option]);
                            } else if (value.includes(option)) {
                              onChange(
                                value.filter((item: string) => item !== option)
                              );
                            } else {
                              onChange([...value, option]);
                            }
                          }}
                          onClear={(event) => {
                            event.stopPropagation();
                            onChange([]);
                          }}
                          isOpen={selectMultiAuthenticatorOpen}
                          aria-labelledby={"client-authenticator"}
                        >
                          {option.options?.map((option) => (
                            <SelectOption key={option} value={option} />
                          ))}
                        </Select>
                      )}
                    />
                  </FormGroup>
                )
              );
            })}
          <ActionGroup>
            <Button
              variant="primary"
              onClick={save}
              data-testid="realm-settings-add-executor-save-button"
            >
              {t("common:add")}
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
        </FormAccess>
      </PageSection>
    </>
  );
};
