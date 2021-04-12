import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { useErrorHandler } from "react-error-boundary";
import {
  ActionGroup,
  AlertVariant,
  Button,
  ButtonVariant,
  ClipboardCopy,
  DropdownItem,
  DropdownSeparator,
  FormGroup,
  PageSection,
  Select,
  SelectOption,
  SelectVariant,
  Stack,
  StackItem,
  Switch,
  Tab,
  TabTitleText,
  TextInput,
} from "@patternfly/react-core";

import RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import { getBaseUrl, toUpperCase } from "../util";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { useAdminClient, asyncStateFetch } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useAlerts } from "../components/alert/Alerts";
import { FormAccess } from "../components/form-access/FormAccess";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { FormattedLink } from "../components/external-link/FormattedLink";
import { KeycloakTabs } from "../components/keycloak-tabs/KeycloakTabs";


export const RealmSettingsLoginTab = () => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const handleError = useErrorHandler();
  const { realm: realmName } = useRealm();
  const { addAlert } = useAlerts();
  const { register, control, getValues, setValue, handleSubmit } = useForm();
  const [realm, setRealm] = useState<RealmRepresentation>();
  const [open, setOpen] = useState(false);

  const baseUrl = getBaseUrl(adminClient);

  useEffect(() => {
    return asyncStateFetch(
      () => adminClient.realms.findOne({ realm: realmName }),
      (realm) => {
        setRealm(realm);
        setupForm(realm);
      },
      handleError
    );
  }, []);

  const setupForm = (realm: RealmRepresentation) => {
    Object.entries(realm).map((entry) => setValue(entry[0], entry[1]));
  };

  const save = async (realm: RealmRepresentation) => {
    try {
      await adminClient.realms.update({ realm: realmName }, realm);
      setRealm(realm);
      addAlert(t("saveSuccess"), AlertVariant.success);
    } catch (error) {
      addAlert(t("saveError", { error }), AlertVariant.danger);
    }
  };

  return (
    <>
      <PageSection variant="light">
          <FormGroup
            label={t("endpoints")}
            labelIcon={
              <HelpItem
                helpText="realm-settings-help:endpoints"
                forLabel={t("endpoints")}
                forID="kc-endpoints"
              />
            }
            fieldId="kc-endpoints"
          >
          </FormGroup>

          <ActionGroup>
            <Button variant="primary" type="submit">
              {t("common:save")}
            </Button>
            <Button variant="link" onClick={() => setupForm(realm!)}>
              {t("common:revert")}
            </Button>
          </ActionGroup>
      </PageSection>
    </>
  );
};
