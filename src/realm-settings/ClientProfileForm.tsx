import React, { useMemo, useState } from "react";
import {
  ActionGroup,
  AlertVariant,
  Button,
  ButtonVariant,
  DataList,
  DataListCell,
  DataListItem,
  DataListItemCells,
  DataListItemRow,
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
import { PlusCircleIcon, TrashIcon } from "@patternfly/react-icons";
import "./RealmSettingsSection.css";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { toAddExecutor } from "./routes/AddExecutor";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";

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
  const history = useHistory();
  const { realm, profileName } =
    useParams<{ realm: string; profileName: string }>();
  const serverInfo = useServerInfo();
  const executorTypes = useMemo(
    () =>
      serverInfo.componentTypes?.[
        "org.keycloak.services.clientpolicy.executor.ClientPolicyExecutorProvider"
      ],
    []
  );
  const [executorToDelete, setExecutorToDelete] =
    useState<{ idx: number; name: string }>();
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
      history.push(
        `/${realm}/realm-settings/clientPolicies/${createdProfile.name}`
      );
    } catch (error) {
      addError("realm-settings:createClientProfileError", error);
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: executorToDelete?.name!
      ? t("deleteExecutorProfileConfirmTitle")
      : t("deleteClientProfileConfirmTitle"),
    messageKey: executorToDelete?.name!
      ? t("deleteExecutorProfileConfirm", {
          executorName: executorToDelete.name!,
        })
      : t("deleteClientProfileConfirm", {
          profileName,
        }),
    continueButtonLabel: t("delete"),
    continueButtonVariant: ButtonVariant.danger,

    onConfirm: async () => {
      if (executorToDelete?.name!) {
        profileExecutors.splice(executorToDelete.idx!, 1);
        try {
          await adminClient.clientPolicies.createProfiles({
            profiles: profiles,
            globalProfiles,
          });
          addAlert(t("deleteExecutorSuccess"), AlertVariant.success);
          history.push(
            `/${realm}/realm-settings/clientPolicies/${profileName}`
          );
        } catch (error) {
          addError(t("deleteExecutorError"), error);
        }
      } else {
        const updatedProfiles = profiles.filter(
          (profile) => profile.name !== profileName
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
      }
    },
  });

  const profile = profiles.filter((profile) => profile.name === profileName);
  const profileExecutors = profile[0]?.executors || [];

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
            {editMode ? (
              <Button
                id={"reloadProfile"}
                variant="link"
                data-testid={"reloadProfile"}
              >
                {t("realm-settings:reload")}
              </Button>
            ) : (
              <Button
                id={"cancelCreateProfile"}
                component={(props) => (
                  <Link
                    {...props}
                    to={`/${realm}/realm-settings/clientPolicies`}
                  />
                )}
                data-testid={"cancelCreateProfile"}
              >
                {t("common:cancel")}
              </Button>
            )}
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
              {profileExecutors.length > 0 ? (
                <DataList aria-label={t("executors")} isCompact>
                  {profileExecutors.map((executor, idx) => (
                    <DataListItem
                      aria-labelledby={"executors-list-item"}
                      key={`list-item-${idx}`}
                      id={executor.executor}
                    >
                      <DataListItemRow data-testid="executors-list-row">
                        <DataListItemCells
                          dataListCells={[
                            <DataListCell
                              key={`name-${idx}`}
                              data-testid="executor-type"
                            >
                              {Object.keys(executor.configuration!).length !==
                              0 ? (
                                <Link
                                  key={executor.executor}
                                  data-testid="executor-type-link"
                                  to={""}
                                  className="kc-executor-link"
                                >
                                  {executor.executor}
                                </Link>
                              ) : (
                                // eslint-disable-next-line react/jsx-no-useless-fragment
                                <>{executor.executor}</>
                              )}
                              {executorTypes?.map((type) => (
                                <>
                                  {""}
                                  {type.id === executor.executor && (
                                    <>
                                      <HelpItem
                                        key={`executorType-${type.id}`}
                                        helpText={type.helpText}
                                        forLabel={t("executorTypeTextHelpText")}
                                        forID={t(`common:helpLabel`, {
                                          label: t("executorTypeTextHelpText"),
                                        })}
                                      />
                                      <TrashIcon
                                        key={`executorType-trash-icon-${type.id}`}
                                        className="kc-executor-trash-icon"
                                        data-testid="deleteClientProfileDropdown"
                                        onClick={() => {
                                          toggleDeleteDialog();
                                          setExecutorToDelete({
                                            idx: idx,
                                            name: type.id,
                                          });
                                        }}
                                      />
                                    </>
                                  )}
                                </>
                              ))}
                            </DataListCell>,
                          ]}
                        />
                      </DataListItemRow>
                    </DataListItem>
                  ))}
                </DataList>
              ) : (
                <>
                  <Divider />
                  <Text
                    className="kc-emptyExecutors"
                    component={TextVariants.h6}
                  >
                    {t("realm-settings:emptyExecutors")}
                  </Text>
                </>
              )}
            </>
          )}
        </FormAccess>
      </PageSection>
    </>
  );
};
