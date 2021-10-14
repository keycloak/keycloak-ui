import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
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

import { FormAccess } from "../components/form-access/FormAccess";
import { FormPanel } from "../components/scroll-form/FormPanel";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import type ClientPolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientPolicyRepresentation";
import { camelCase } from "lodash";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import { useAlerts } from "../components/alert/Alerts";
import { useParams } from "react-router";
import type ClientProfileRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientProfileRepresentation";
import type ClientPolicyConditionRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientPolicyConditionRepresentation";
import type ComponentTypeRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentTypeRepresentation";
import type { EditClientPolicyParams } from "./routes/EditClientPolicy";

export type KeyValueType = { key: string; value: string };

export const NewClientPolicyCondition = () => {
  const { t } = useTranslation("realm-settings");
  const { addAlert, addError } = useAlerts();

  const form = useForm<ClientPolicyRepresentation>({
    mode: "onChange",
  });

  const [openProvider, setOpenProvider] = useState(false);
  const [policies, setPolicies] = useState<ClientProfileRepresentation[]>([]);
  const [conditions, setConditions] = useState<
    ClientPolicyConditionRepresentation[]
  >([]);
  const [theCurrentPolicy, setTheCurrentPolicy] =
    useState<ClientPolicyRepresentation>();

  const { policyName } = useParams<EditClientPolicyParams>();

  const serverInfo = useServerInfo();

  const conditionTypes =
    serverInfo.componentTypes?.[
      "org.keycloak.services.clientpolicy.condition.ClientPolicyConditionProvider"
    ];

  const adminClient = useAdminClient();

  useFetch(
    () => adminClient.clientPolicies.listPolicies(),
    (policies) => {
      setPolicies(policies.policies ?? []);
      const currentPolicy = policies.policies?.find(
        (item) => item.name === policyName
      );
      setTheCurrentPolicy(currentPolicy);
      return currentPolicy;
    },
    []
  );

  const save = async () => {
    const createdPolicy = {
      ...theCurrentPolicy,
      profiles: [],
      conditions: conditions,
    };

    const index = policies.findIndex(
      (policy) => createdPolicy.name === policy.name
    );

    if (index === -1) {
      return;
    }

    const newPolicies = [
      ...policies.slice(0, index),
      createdPolicy,
      ...policies.slice(index + 1),
    ];

    try {
      await adminClient.clientPolicies.updatePolicy({
        policies: newPolicies,
      });
      setPolicies(newPolicies);
      addAlert(
        t("realm-settings:createClientPolicySuccess"),
        AlertVariant.success
      );
    } catch (error) {
      addError("realm-settings:createClientProfileError", error);
    }
  };

  return (
    <PageSection variant="light">
      <FormPanel className="kc-login-screen" title="Add condition">
        <FormAccess
          isHorizontal
          role="manage-realm"
          className="pf-u-mt-lg"
          onSubmit={form.handleSubmit(save)}
        >
          <FormGroup
            label={t("conditionType")}
            labelIcon={
              <HelpItem
                helpText="authentication-help:flowType"
                forLabel={t("conditionType")}
                forID="conditionType"
              />
            }
            fieldId="conditionType"
          >
            <Controller
              name="conditions"
              defaultValue={conditionTypes![0].id}
              control={form.control}
              render={({ onChange, value }) => (
                <Select
                  menuAppendTo="parent"
                  toggleId="provider"
                  onToggle={(toggle) => setOpenProvider(toggle)}
                  onSelect={(_, value) => {
                    onChange(value as string);
                    setConditions([
                      {
                        condition: (value as ComponentTypeRepresentation).id,
                        configuration: {},
                      },
                    ]);
                    setOpenProvider(false);
                  }}
                  selections={value.id}
                  variant={SelectVariant.single}
                  aria-label={t("flowType")}
                  isOpen={openProvider}
                >
                  {conditionTypes?.map((condition) => (
                    <SelectOption
                      selected={condition.id === value}
                      description={t(
                        `${camelCase(condition.id.replace(/-/g, " "))}`
                      )}
                      key={condition.id}
                      value={condition}
                    >
                      {condition.id}
                    </SelectOption>
                  ))}
                </Select>
              )}
            />
          </FormGroup>
          <ActionGroup>
            <Button
              variant="primary"
              // isDisabled={!formState.isDirty}
              type="submit"
              data-testid="localization-tab-save"
            >
              {t("common:save")}
            </Button>
            <Button
              variant="link"
              //  onClick={reset}
            >
              {t("common:revert")}
            </Button>
          </ActionGroup>
        </FormAccess>
      </FormPanel>
    </PageSection>
  );
};
