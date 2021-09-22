import React, { useState } from "react";
import {
  ActionGroup,
  AlertVariant,
  Button,
  Divider,
  FormGroup,
  PageSection,
  TextArea,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { FormAccess } from "../components/form-access/FormAccess";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { Link } from "react-router-dom";
import { useRealm } from "../context/realm-context/RealmContext";
import { useAlerts } from "../components/alert/Alerts";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import type ClientProfileRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientProfileRepresentation";
import type ClientPolicyExecutorRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientPolicyExecutorRepresentation";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { PlusCircleIcon } from "@patternfly/react-icons";
import "./RealmSettingsSection.css";

type NewClientProfileForm = {
  name: string;
  executors: ClientPolicyExecutorRepresentation[];
  description: string;
};

const defaultValues: NewClientProfileForm = {
  name: "",
  executors: [],
  description: "",
};

export const NewClientProfileForm = () => {
  const { t } = useTranslation("realm-settings");
  const { getValues, register, errors } = useForm<NewClientProfileForm>({
    defaultValues,
  });
  const { realm } = useRealm();
  const { addAlert, addError } = useAlerts();
  const adminClient = useAdminClient();
  const [globalProfiles, setGlobalProfiles] = useState<
    ClientProfileRepresentation[]
  >([]);
  const [profiles, setProfiles] = useState<ClientProfileRepresentation[]>([]);
  const [showAddExecutorsForm, setShowAddExecutorsForm] = useState(false);

  useFetch(
    async () =>
      await adminClient.clientPolicies.listProfiles({
        includeGlobalProfiles: true,
      }),
    (profiles) => {
      setGlobalProfiles(
        profiles.globalProfiles as ClientProfileRepresentation[]
      );
      setProfiles(profiles.profiles as ClientProfileRepresentation[]);
    },
    []
  );

  const save = async () => {
    const form = getValues();

    const createdProfile = {
      name: form.name,
      executors: [],
      description: form.description,
    };

    const allProfiles = profiles.concat(createdProfile);

    const profilesToSave = {
      profiles: allProfiles,
      globalProfiles: globalProfiles,
    };

    try {
      await adminClient.clientPolicies.createProfiles({
        ...profilesToSave,
      });
      addAlert(
        t("realm-settings:createClientProfileSuccess"),
        AlertVariant.success
      );
      setShowAddExecutorsForm(true);
    } catch (error) {
      addError("realm-settings:createClientProfileError", error);
    }
  };

  return (
    <>
      <ViewHeader titleKey={t("newClientProfile")} divider />
      <PageSection variant="light">
        <FormAccess isHorizontal role="view-realm" className="pf-u-mt-lg">
          <FormGroup
            label={t("newClientProfileName")}
            fieldId="kc-name"
            helperText={t("createClientProfileNameHelperText")}
            isRequired
            helperTextInvalid={t("common:required")}
            validated={
              errors.name ? ValidatedOptions.error : ValidatedOptions.default
            }
          >
            <TextInput
              ref={register({ required: true })}
              type="text"
              id="kc-client-profile-name"
              name="name"
            />
          </FormGroup>
          <FormGroup label={t("common:description")} fieldId="kc-description">
            <TextArea
              name="description"
              aria-label={t("description")}
              ref={register()}
              type="text"
              id="kc-client-profile-description"
            />
          </FormGroup>
          <ActionGroup>
            <Button
              variant="primary"
              onClick={save}
              data-testid="realm-settings-client-profile-save-button"
            >
              {t("common:save")}
            </Button>
            <Button
              id="cancelCreateProfile"
              component={Link}
              // @ts-ignore
              to={`/${realm}/realm-settings/clientPolicies`}
              data-testid="cancelCreateProfile"
            >
              {t("common:cancel")}
            </Button>
          </ActionGroup>
          {showAddExecutorsForm && (
            <>
              <FormGroup
                label={t("executors")}
                fieldId="kc-executors"
                labelIcon={
                  <HelpItem
                    helpText={t("realm-settings:executorsHelpText")}
                    forLabel={t("executorsHelpItem")}
                    forID={t("executors")}
                  />
                }
              >
                <Button
                  id="addExecutor"
                  component={Link}
                  variant="link"
                  className="kc-addExecutor"
                  // @ts-ignore
                  to={`/${realm}/realm-settings/clientPolicies`}
                  data-testid="cancelCreateProfile"
                  icon={<PlusCircleIcon />}
                >
                  {t("realm-settings:addExecutor")}
                </Button>
              </FormGroup>
              <Divider />
            </>
          )}
        </FormAccess>
      </PageSection>
    </>
  );
};
