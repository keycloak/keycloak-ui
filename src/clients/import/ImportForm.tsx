import React from "react";
import {
  PageSection,
  FormGroup,
  TextInput,
  ActionGroup,
  Button,
  AlertVariant,
} from "@patternfly/react-core";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

import { ClientDescription } from "../ClientDescription";
import { JsonFileUpload } from "../../components/json-file-upload/JsonFileUpload";
import { useAlerts } from "../../components/alert/Alerts";
import { ViewHeader } from "../../components/view-header/ViewHeader";
import ClientRepresentation from "keycloak-admin/lib/defs/clientRepresentation";
import { useAdminClient } from "../../context/auth/AdminClient";
import { FormAccess } from "../../components/form-access/FormAccess";

export const ImportForm = () => {
  const { t } = useTranslation("clients");
  const adminClient = useAdminClient();
  const form = useForm<ClientRepresentation>();
  const { register, handleSubmit, setValue } = form;

  const { addAlert } = useAlerts();

  const handleFileChange = (value: string | File) => {
    const defaultClient = {
      protocol: "",
      clientId: "",
      name: "",
      description: "",
    };

    const obj = value ? JSON.parse(value as string) : defaultClient;
    Object.keys(obj).forEach((k) => {
      setValue(k, obj[k]);
    });
  };

  const save = async (client: ClientRepresentation) => {
    try {
      await adminClient.clients.create({ ...client });
      addAlert(t("clientImportSuccess"), AlertVariant.success);
    } catch (error) {
      addAlert(`${t("clientImportError")} '${error}'`, AlertVariant.danger);
    }
  };
  return (
    <>
      <ViewHeader
        titleKey="clients:importClient"
        subKey="clients:clientsExplain"
      />
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          onSubmit={handleSubmit(save)}
          role="manage-clients"
        >
          <FormProvider {...form}>
            <JsonFileUpload id="realm-file" onChange={handleFileChange} />
            <ClientDescription />
            <FormGroup label={t("common:type")} fieldId="kc-type">
              <TextInput
                type="text"
                id="kc-type"
                name="protocol"
                isReadOnly
                ref={register()}
              />
            </FormGroup>
            <ActionGroup>
              <Button variant="primary" type="submit">
                {t("common:save")}
              </Button>
              <Button variant="link">{t("common:cancel")}</Button>
            </ActionGroup>
          </FormProvider>
        </FormAccess>
      </PageSection>
    </>
  );
};
