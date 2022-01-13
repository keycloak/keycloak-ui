import React, { FunctionComponent, useState } from "react";
import { Link, useHistory, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormProvider, useForm } from "react-hook-form";
import {
  ActionGroup,
  AlertVariant,
  Button,
  ButtonVariant,
  DropdownItem,
  PageSection,
} from "@patternfly/react-core";

import type PolicyRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyRepresentation";
import {
  PolicyDetailsParams,
  toPolicyDetails,
} from "../../routes/PolicyDetails";
import { ViewHeader } from "../../../components/view-header/ViewHeader";
import { useConfirmDialog } from "../../../components/confirm-dialog/ConfirmDialog";
import { useAdminClient, useFetch } from "../../../context/auth/AdminClient";
import { FormAccess } from "../../../components/form-access/FormAccess";
import { useAlerts } from "../../../components/alert/Alerts";
import { toClient } from "../../routes/Client";
import { Aggregate } from "./Aggregate";
import { Client } from "./Client";

const COMPONENTS: {
  [index: string]: FunctionComponent;
} = {
  aggregate: Aggregate,
  client: Client,
} as const;

const isValidComponentType = (value: string): boolean => value in COMPONENTS;

export default function PolicyDetails() {
  const { t } = useTranslation("clients");
  const { id, realm, policyId, policyType } = useParams<PolicyDetailsParams>();
  const history = useHistory();
  const form = useForm<PolicyRepresentation>();
  const { reset, handleSubmit } = form;

  const adminClient = useAdminClient();
  const { addAlert, addError } = useAlerts();

  const [policy, setPolicy] = useState<PolicyRepresentation>();

  useFetch(
    async () => {
      if (policyId) {
        const policy = (await adminClient.clients.findOnePolicy({
          id,
          type: policyType,
          policyId,
        })) as PolicyRepresentation | undefined;

        if (!policy) {
          throw new Error(t("common:notFound"));
        }

        return policy;
      }
    },
    (policy) => {
      reset({ ...policy });
      setPolicy(policy);
    },
    []
  );

  const save = async (policy: PolicyRepresentation) => {
    try {
      if (policyId) {
        await adminClient.clients.updatePolicy(
          { id, type: policyType, policyId },
          policy
        );
      } else {
        const result = await adminClient.clients.createPolicy(
          { id, type: policyType },
          policy
        );
        history.push(
          toPolicyDetails({
            realm,
            id,
            policyType,
            policyId: result.id!,
          })
        );
      }
      addAlert(
        t((policyId ? "update" : "create") + "PolicySuccess"),
        AlertVariant.success
      );
    } catch (error) {
      addError("clients:policySaveError", error);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "clients:deletePolicy",
    messageKey: "clients:deletePolicyConfirm",
    continueButtonLabel: "clients:confirm",
    onConfirm: async () => {
      try {
        await adminClient.clients.delPolicy({
          id,
          policyId,
        });
        addAlert(t("policyDeletedSuccess"), AlertVariant.success);
        history.push(toClient({ realm, clientId: id, tab: "authorization" }));
      } catch (error) {
        addError("clients:policyDeletedError", error);
      }
    },
  });

  if (!isValidComponentType(policyType)) {
    throw new Error(`Not a supported ${policyType}!`);
  }
  const ComponentType = COMPONENTS[policyType];

  return (
    <>
      <DeleteConfirm />
      <ViewHeader
        titleKey={policyId ? policy?.name! : "clients:createPolicy"}
        dropdownItems={
          policyId
            ? [
                <DropdownItem
                  key="delete"
                  data-testid="delete-policy"
                  onClick={() => toggleDeleteDialog()}
                >
                  {t("common:delete")}
                </DropdownItem>,
              ]
            : undefined
        }
      />
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          onSubmit={handleSubmit(save)}
          role="manage-clients"
        >
          <FormProvider {...form}>
            <ComponentType />
          </FormProvider>
          <ActionGroup>
            <div className="pf-u-mt-md">
              <Button
                variant={ButtonVariant.primary}
                type="submit"
                data-testid="save"
              >
                {t("common:save")}
              </Button>

              <Button
                variant="link"
                data-testid="cancel"
                component={(props) => (
                  <Link
                    {...props}
                    to={toClient({
                      realm,
                      clientId: id,
                      tab: "authorization",
                    })}
                  />
                )}
              >
                {t("common:cancel")}
              </Button>
            </div>
          </ActionGroup>
        </FormAccess>
      </PageSection>
    </>
  );
}
