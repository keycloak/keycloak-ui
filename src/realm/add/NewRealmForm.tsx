import React, { useContext } from "react";
import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  PageSection,
  FormGroup,
  TextInput,
  Switch,
  ActionGroup,
  Button,
  AlertVariant,
} from "@patternfly/react-core";

import { JsonFileUpload } from "../../components/json-file-upload/JsonFileUpload";
import { useAlerts } from "../../components/alert/Alerts";
import { useForm, Controller } from "react-hook-form";
import { ViewHeader } from "../../components/view-header/ViewHeader";
import type RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import { useAdminClient } from "../../context/auth/AdminClient";
import { WhoAmIContext } from "../../context/whoami/WhoAmI";
import { FormAccess } from "../../components/form-access/FormAccess";
import { useRealm } from "../../context/realm-context/RealmContext";

export const NewRealmForm = () => {
  const { t } = useTranslation("realm");
  const history = useHistory();
  const { refresh } = useContext(WhoAmIContext);
  const { refresh: realmRefresh } = useRealm();
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();

  const { register, handleSubmit, control, errors, setValue } =
    useForm<RealmRepresentation>({ mode: "onChange" });

  const handleFileChange = (obj: object) => {
    const defaultRealm = { id: "", realm: "", enabled: true };
    Object.entries(obj || defaultRealm).map((entry) =>
      setValue(entry[0], entry[1])
    );
  };

  const save = async (realm: RealmRepresentation) => {
    try {
      await adminClient.realms.create(realm);
      addAlert(t("saveRealmSuccess"), AlertVariant.success);

      //force token update
      refresh();
      await adminClient.keycloak?.updateToken(Number.MAX_VALUE);
      await realmRefresh();
      history.push(`/${realm.realm}`);
    } catch (error) {
      addAlert(
        t("saveRealmError", {
          error: error.response?.data?.errorMessage || error,
        }),
        AlertVariant.danger
      );
    }
  };

  return (
    <>
      <ViewHeader titleKey="realm:createRealm" subKey="realm:realmExplain" />
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          onSubmit={handleSubmit(save)}
          role="manage-realm"
        >
          <JsonFileUpload
            id="kc-realm-filename"
            allowEditingUploadedText
            onChange={handleFileChange}
          />
          <FormGroup
            label={t("realmName")}
            isRequired
            fieldId="kc-realm-name"
            validated={errors.realm ? "error" : "default"}
            helperTextInvalid={t("common:required")}
          >
            <TextInput
              isRequired
              type="text"
              id="kc-realm-name"
              name="realm"
              validated={errors.realm ? "error" : "default"}
              ref={register({ required: true })}
            />
          </FormGroup>
          <FormGroup label={t("enabled")} fieldId="kc-realm-enabled-switch">
            <Controller
              name="enabled"
              defaultValue={true}
              control={control}
              render={({ onChange, value }) => (
                <Switch
                  id="kc-realm-enabled-switch"
                  name="enabled"
                  label={t("common:on")}
                  labelOff={t("common:off")}
                  isChecked={value}
                  onChange={onChange}
                />
              )}
            />
          </FormGroup>
          <ActionGroup>
            <Button variant="primary" type="submit">
              {t("common:create")}
            </Button>
            <Button variant="link" onClick={() => history.goBack()}>
              {t("common:cancel")}
            </Button>
          </ActionGroup>
        </FormAccess>
      </PageSection>
    </>
  );
};
