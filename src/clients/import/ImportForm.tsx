import {
  ActionGroup,
  AlertVariant,
  Button,
  FormGroup,
  PageSection,
  TextInput,
} from "@patternfly/react-core";
import type ClientRepresentation from "keycloak-admin/lib/defs/clientRepresentation";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";
import { useAlerts } from "../../components/alert/Alerts";
import { FormAccess } from "../../components/form-access/FormAccess";
import { JsonFileUpload } from "../../components/json-file-upload/JsonFileUpload";
import { ViewHeader } from "../../components/view-header/ViewHeader";
import { useAdminClient } from "../../context/auth/AdminClient";
import { useRealm } from "../../context/realm-context/RealmContext";
import { convertFormValuesToObject, convertToFormValues } from "../../util";
import { CapabilityConfig } from "../add/CapabilityConfig";
import { ClientDescription } from "../ClientDescription";
import { toClient } from "../routes/Client";
import { toClients } from "../routes/Clients";

const ImportForm = () => {
  const { t } = useTranslation("clients");
  const history = useHistory();
  const adminClient = useAdminClient();
  const { realm } = useRealm();
  const form = useForm<ClientRepresentation>();
  const { register, handleSubmit, setValue } = form;

  const { addAlert } = useAlerts();

  const handleFileChange = (obj: object) => {
    const defaultClient = {
      protocol: "",
      clientId: "",
      name: "",
      description: "",
    };

    Object.entries(obj || defaultClient).forEach((entries) => {
      if (entries[0] === "attributes") {
        convertToFormValues(entries[1], "attributes", form.setValue);
      } else {
        setValue(entries[0], entries[1]);
      }
    });
  };

  const save = async (client: ClientRepresentation) => {
    try {
      const newClient = await adminClient.clients.create({
        ...client,
        attributes: convertFormValuesToObject(client.attributes || {}),
      });
      addAlert(t("clientImportSuccess"), AlertVariant.success);
      history.push(
        toClient({ realm, clientId: newClient.id, tab: "settings" })
      );
    } catch (error) {
      addAlert(t("clientImportError", { error }), AlertVariant.danger);
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
            <CapabilityConfig unWrap={true} />
            <ActionGroup>
              <Button variant="primary" type="submit">
                {t("common:save")}
              </Button>
              {/* @ts-ignore */}
              <Button variant="link" component={Link} to={toClients({ realm })}>
                {t("common:cancel")}
              </Button>
            </ActionGroup>
          </FormProvider>
        </FormAccess>
      </PageSection>
    </>
  );
};

export default ImportForm;
