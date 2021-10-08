import React, { useState } from "react";
import {
  ActionGroup,
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
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { Controller, useForm } from "react-hook-form";
import type ComponentTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentTypeRepresentation";

export const ExecutorForm = () => {
  const { t } = useTranslation("realm-settings");
  const [open, setOpen] = useState(false);
  const [executor, setExecutor] = useState<ComponentTypeRepresentation[]>();

  const {
    register,
    control,
    handleSubmit,
    formState: { isDirty },
  } = useForm();
  const serverInfo = useServerInfo();
  const executorTypes =
    serverInfo.componentTypes?.[
      "org.keycloak.services.clientpolicy.executor.ClientPolicyExecutorProvider"
    ];

  const save = () => {
    console.log("save");
  };

  return (
    <>
      <ViewHeader titleKey={t("addExecutor")} divider />
      <PageSection variant="light">
        <FormAccess isHorizontal role="manage-realm" className="pf-u-mt-lg">
          <FormGroup label={t("executorType")} fieldId="kc-executorType">
            <Controller
              name="executorType"
              control={control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="kc-clientPolicy-executorType"
                  placeholderText="Select an executor"
                  onToggle={() => setOpen(!open)}
                  onSelect={(_, value) => {
                    onChange(value.toString());
                    const selectedExecutor = executorTypes?.filter(
                      (type) => type.id === value
                    );
                    setExecutor(selectedExecutor);
                    setOpen(false);
                  }}
                  selections={value}
                  variant={SelectVariant.single}
                  aria-label={t("executorType")}
                  isOpen={open}
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
