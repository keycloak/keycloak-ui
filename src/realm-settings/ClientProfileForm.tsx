import React, { useState } from "react";
import {
  ActionGroup,
  AlertVariant,
  Button,
  ButtonVariant,
  Divider,
  DropdownItem,
  Flex,
  FlexItem,
  FormGroup,
  PageSection,
  Text,
  TextArea,
  TextInput,
  TextVariants,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { FormAccess } from "../components/form-access/FormAccess";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { Link, useHistory, useParams } from "react-router-dom";
import { useAlerts } from "../components/alert/Alerts";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import type ClientProfileRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientProfileRepresentation";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { PlusCircleIcon } from "@patternfly/react-icons";
import "./RealmSettingsSection.css";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { toAddExecutor } from "./routes/AddExecutor";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import type ClientPolicyExecutorRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientPolicyExecutorRepresentation";

type ClientProfileForm = Required<ClientProfileRepresentation>;

const defaultValues: ClientProfileForm = {
  name: "",
  description: "",
  executors: [],
};

export const ClientProfileForm = () => {
  const { t } = useTranslation("realm-settings");
  const { getValues, register, errors } = useForm<ClientProfileForm>({
    defaultValues,
  });
  const { addAlert, addError } = useAlerts();
  const adminClient = useAdminClient();
  const [globalProfiles, setGlobalProfiles] = useState<
    ClientProfileRepresentation[]
  >([]);
  const [profiles, setProfiles] = useState<ClientProfileRepresentation[]>([]);
  const [createdProfile, setCreatedProfile] =
    useState<ClientProfileRepresentation>();
  const history = useHistory();
  const { realm, profileName } =
    useParams<{ realm: string; profileName: string }>();
  const editMode = profileName ? true : false;

  useFetch(
    () =>
      adminClient.clientPolicies.listProfiles({ includeGlobalProfiles: true }),
    (profiles) => {
      setGlobalProfiles(profiles.globalProfiles ?? []);
      setProfiles(profiles.profiles ?? []);
    },
    []
  );

  const save = async () => {
    const form = getValues();

    const createdProfile = {
      ...form,
      executors: [],
    };

    const allProfiles = profiles.concat(createdProfile);

    try {
      await adminClient.clientPolicies.createProfiles({
        profiles: allProfiles,
        globalProfiles: globalProfiles,
      });
      addAlert(
        t("realm-settings:createClientProfileSuccess"),
        AlertVariant.success
      );
      setCreatedProfile(createdProfile);
      history.push(
        `/${realm}/realm-settings/clientPolicies/${createdProfile.name}`
      );
    } catch (error) {
      addError("realm-settings:createClientProfileError", error);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteClientProfileConfirmTitle"),
    messageKey: t("deleteClientProfileConfirm"),
    continueButtonLabel: t("delete"),
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      const updatedProfiles = profiles.filter(
        (profile) => profile.name !== createdProfile?.name
      );

      try {
        await adminClient.clientPolicies.createProfiles({
          profiles: updatedProfiles,
          globalProfiles,
        });
        addAlert(t("deleteClientSuccess"), AlertVariant.success);
        history.push(`/${realm}/realm-settings/clientPolicies`);
      } catch (error) {
        addError(t("deleteClientError"), error);
      }
    },
  });

  const profile = profiles.filter((profile) => profile.name === profileName);
  const profileExecutors = profile[0]?.executors || [];
  const loader = async () => [profileExecutors[0]];

  const cellFormatter = (row: ClientPolicyExecutorRepresentation) => (
    <Link to="/">{row.executor}</Link>
  );

  return (
    <>
      <DeleteConfirm />
      <ViewHeader
        titleKey={editMode ? profileName : t("newClientProfile")}
        divider
        dropdownItems={
          editMode
            ? [
                <DropdownItem
                  key="delete"
                  value="delete"
                  onClick={toggleDeleteDialog}
                  data-testid="deleteClientProfileDropdown"
                >
                  {t("deleteClientProfile")}
                </DropdownItem>,
              ]
            : undefined
        }
      />
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
              data-testid="client-profile-name"
            />
          </FormGroup>
          <FormGroup label={t("common:description")} fieldId="kc-description">
            <TextArea
              name="description"
              aria-label={t("description")}
              ref={register()}
              type="text"
              id="kc-client-profile-description"
              data-testid="client-profile-description"
            />
          </FormGroup>
          <ActionGroup>
            <Button
              variant="primary"
              onClick={save}
              data-testid="saveCreateProfile"
              isDisabled={editMode ? true : false}
            >
              {t("common:save")}
            </Button>
            <Button
              id="cancelCreateProfile"
              component={(props) => (
                <Link
                  {...props}
                  to={`/${realm}/realm-settings/clientPolicies`}
                />
              )}
              data-testid="cancelCreateProfile"
            >
              {editMode ? t("realm-settings:reload") : t("common:cancel")}
            </Button>
          </ActionGroup>
          {editMode && (
            <>
              <Flex>
                <FlexItem>
                  <Text className="kc-executors" component={TextVariants.h1}>
                    {t("executors")}
                    <HelpItem
                      helpText={t("realm-settings:executorsHelpText")}
                      forLabel={t("executorsHelpItem")}
                      forID={t("executors")}
                    />
                  </Text>
                </FlexItem>
                <FlexItem align={{ default: "alignRight" }}>
                  <Button
                    id="addExecutor"
                    component={(props) => (
                      <Link
                        {...props}
                        to={toAddExecutor({
                          realm,
                          profileName,
                        })}
                      ></Link>
                    )}
                    variant="link"
                    className="kc-addExecutor"
                    data-testid="cancelCreateProfile"
                    icon={<PlusCircleIcon />}
                  >
                    {t("realm-settings:addExecutor")}
                  </Button>
                </FlexItem>
              </Flex>
              <Divider />
              {profileExecutors.length > 0 ? (
                <KeycloakDataTable
                  key={profileExecutors.length}
                  ariaLabelKey="realm-settings:profiles"
                  loader={loader}
                  actions={[
                    {
                      title: t("common:delete"),
                      onRowClick: (executor) => {
                        console.log(executor);
                        toggleDeleteDialog();
                      },
                    },
                  ]}
                  columns={[
                    {
                      name: "name",
                      displayKey: t("clientProfileName"),
                      cellRenderer: cellFormatter,
                    },
                  ]}
                />
              ) : (
                <Text className="kc-emptyExecutors" component={TextVariants.h6}>
                  {t("realm-settings:emptyExecutors")}
                </Text>
              )}
            </>
          )}
        </FormAccess>
      </PageSection>
    </>
  );
};
