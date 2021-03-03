import React, { useEffect } from "react";
import {
  ActionGroup,
  AlertVariant,
  Button,
  ButtonVariant,
  DropdownItem,
  DropdownSeparator,
  Form,
  PageSection,
} from "@patternfly/react-core";

import { LdapSettingsAdvanced } from "./ldap/LdapSettingsAdvanced";
import { LdapSettingsKerberosIntegration } from "./ldap/LdapSettingsKerberosIntegration";
import { SettingsCache } from "./shared/SettingsCache";
import { LdapSettingsSynchronization } from "./ldap/LdapSettingsSynchronization";
import { LdapSettingsGeneral } from "./ldap/LdapSettingsGeneral";
import { LdapSettingsConnection } from "./ldap/LdapSettingsConnection";
import { LdapSettingsSearching } from "./ldap/LdapSettingsSearching";

import { useRealm } from "../context/realm-context/RealmContext";
import { convertToFormValues } from "../util";
import ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";

import { Controller, useForm } from "react-hook-form";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { useAdminClient } from "../context/auth/AdminClient";
import { useAlerts } from "../components/alert/Alerts";
import { useTranslation } from "react-i18next";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useHistory, useParams } from "react-router-dom";
import { ScrollForm } from "../components/scroll-form/ScrollForm";

type LdapSettingsHeaderProps = {
  onChange: (value: string) => void;
  value: string;
  save: () => void;
  toggleDeleteDialog: () => void;
  toggleRemoveUsersDialog: () => void;
};

const LdapSettingsHeader = ({
  onChange,
  value,
  save,
  toggleDeleteDialog,
  toggleRemoveUsersDialog,
}: LdapSettingsHeaderProps) => {
  const { t } = useTranslation("user-federation");
  const { id } = useParams<{ id: string }>();
  const [toggleDisableDialog, DisableConfirm] = useConfirmDialog({
    titleKey: "user-federation:userFedDisableConfirmTitle",
    messageKey: "user-federation:userFedDisableConfirm",
    continueButtonLabel: "common:disable",
    onConfirm: () => {
      onChange("false");
      save();
    },
  });
  return (
    <>
      <DisableConfirm />
      {id === "new" ? (
        <ViewHeader titleKey="LDAP" subKey="" />
      ) : (
        <ViewHeader
          titleKey="LDAP"
          subKey=""
          dropdownItems={[
            <DropdownItem
              key="sync"
              onClick={() => console.log("Sync users TBD")}
            >
              {t("syncChangedUsers")}
            </DropdownItem>,
            <DropdownItem
              key="syncall"
              onClick={() => console.log("Sync all users TBD")}
            >
              {t("syncAllUsers")}
            </DropdownItem>,
            <DropdownItem
              key="unlink"
              onClick={() => console.log("Unlink users TBD")}
            >
              {t("unlinkUsers")}
            </DropdownItem>,
            <DropdownItem
              key="remove"
              onClick={() => toggleRemoveUsersDialog()}
            >
              {t("removeImported")}
            </DropdownItem>,
            <DropdownSeparator key="separator" />,
            <DropdownItem
              key="delete"
              onClick={() => toggleDeleteDialog()}
              data-testid="delete-ldap-cmd"
            >
              {t("deleteProvider")}
            </DropdownItem>,
          ]}
          isEnabled={value === "true"}
          onToggle={(value) => {
            if (!value) {
              toggleDisableDialog();
            } else {
              onChange("" + value);
              save();
            }
          }}
        />
      )}
    </>
  );
};

export const UserFederationLdapSettings = () => {
  const { t } = useTranslation("user-federation");
  const form = useForm<ComponentRepresentation>();
  const history = useHistory();
  const adminClient = useAdminClient();
  const { realm } = useRealm();

  const { id } = useParams<{ id: string }>();
  const { addAlert } = useAlerts();

  useEffect(() => {
    (async () => {
      if (id !== "new") {
        const fetchedComponent = await adminClient.components.findOne({ id });
        if (fetchedComponent) {
          setupForm(fetchedComponent);
        }
      }
    })();
  }, []);

  const setupForm = (component: ComponentRepresentation) => {
    Object.entries(component).map((entry) => {
      if (entry[0] === "config") {
        convertToFormValues(entry[1], "config", form.setValue);
      } else {
        form.setValue(entry[0], entry[1]);
      }
    });
  };

  const save = async (component: ComponentRepresentation) => {
    try {
      if (id) {
        if (id === "new") {
          await adminClient.components.create(component);
          history.push(`/${realm}/user-federation`);
        } else {
          await adminClient.components.update({ id }, component);
        }
      }
      setupForm(component as ComponentRepresentation);
      addAlert(
        t(id === "new" ? "createSuccess" : "saveSuccess"),
        AlertVariant.success
      );
    } catch (error) {
      addAlert(
        `${t(id === "new" ? "createError" : "saveError")} '${error}'`,
        AlertVariant.danger
      );
    }
  };

  const [toggleRemoveUsersDialog, RemoveUsersConfirm] = useConfirmDialog({
    titleKey: t("removeImportedUsers"),
    messageKey: t("removeImportedUsersMessage"),
    continueButtonLabel: "common:remove",
    onConfirm: async () => {
      try {
        console.log("Remove imported TBD");
        // TODO await remove imported users command
        addAlert(t("removeImportedUsersSuccess"), AlertVariant.success);
      } catch (error) {
        addAlert(t("removeImportedUsersError", { error }), AlertVariant.danger);
      }
    },
  });

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "user-federation:userFedDeleteConfirmTitle",
    messageKey: "user-federation:userFedDeleteConfirm",
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.components.del({ id });
        addAlert(t("userFedDeletedSuccess"), AlertVariant.success);
        history.replace(`/${realm}/user-federation`);
      } catch (error) {
        addAlert(`${t("userFedDeleteError")} ${error}`, AlertVariant.danger);
      }
    },
  });

  return (
    <>
      <DeleteConfirm />
      <RemoveUsersConfirm />
      <Controller
        name="config.enabled[0]"
        defaultValue={["true"][0]}
        control={form.control}
        render={({ onChange, value }) => (
          <LdapSettingsHeader
            value={value}
            save={() => save(form.getValues())}
            onChange={onChange}
            toggleDeleteDialog={toggleDeleteDialog}
            toggleRemoveUsersDialog={toggleRemoveUsersDialog}
          />
        )}
      />
      <PageSection variant="light" isFilled>
        <ScrollForm
          sections={[
            t("generalOptions"),
            t("connectionAndAuthenticationSettings"),
            t("ldapSearchingAndUpdatingSettings"),
            t("synchronizationSettings"),
            t("kerberosIntegration"),
            t("cacheSettings"),
            t("advancedSettings"),
          ]}
        >
          <LdapSettingsGeneral form={form} />
          <LdapSettingsConnection form={form} />
          <LdapSettingsSearching form={form} />
          <LdapSettingsSynchronization form={form} />
          <LdapSettingsKerberosIntegration form={form} />
          <SettingsCache form={form} />
          <LdapSettingsAdvanced form={form} />
        </ScrollForm>
        <Form onSubmit={form.handleSubmit(save)}>
          <ActionGroup>
            <Button variant="primary" type="submit" data-testid="ldap-save">
              {t("common:save")}
            </Button>
            <Button
              variant="link"
              onClick={() => history.push(`/${realm}/user-federation`)}
              data-testid="ldap-cancel"
            >
              {t("common:cancel")}
            </Button>
          </ActionGroup>
        </Form>
      </PageSection>
    </>
  );
};
