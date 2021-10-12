import React, { useState } from "react";
import {
  ActionGroup,
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
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { Controller, useForm } from "react-hook-form";
import type ComponentTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentTypeRepresentation";
import type { ConfigPropertyRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigInfoRepresentation";
import { HelpItem } from "../components/help-enabler/HelpItem";

export const ExecutorForm = () => {
  const { t } = useTranslation("realm-settings");
  const [selectExecutorTypeOpen, setSelectExecutorTypeOpen] = useState(false);
  const [selectAlgorithmTypeOpen, setSelectAlgorithmTypeOpen] = useState(false);
  const [selectMultiAuthenticatorOpen, setSelectMultiAuthenticatorOpen] =
    useState(false);
  const serverInfo = useServerInfo();
  const executorTypes =
    serverInfo.componentTypes?.[
      "org.keycloak.services.clientpolicy.executor.ClientPolicyExecutorProvider"
    ];
  const [executors, setExecutors] = useState<ComponentTypeRepresentation[]>([]);
  const [executorProperties, setExecutorProperties] = useState<
    ConfigPropertyRepresentation[]
  >([]);

  const {
    control,
    handleSubmit,
    register,
    formState: { isDirty },
  } = useForm();

  const save = () => {
    console.log("save");
  };

  console.log(executorProperties);

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
              name="executorType"
              control={control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="kc-executorType"
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
                      name="executorTypeSwitch"
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
                      ref={register()}
                      type="text"
                      id="kc-executorType-text"
                      name="executorTypeText"
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
                      name="executorTypeSelectAlgorithm"
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
                    label={t("executorClientAuthenticator")}
                    fieldId="kc-executorAuthenticatorMultiSelect"
                  >
                    <Controller
                      name="executorClientAuthenticator"
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
              onClick={() => console.log("reset")}
              variant="link"
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
