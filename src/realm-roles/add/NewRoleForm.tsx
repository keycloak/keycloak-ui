import React, { useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Text,
  PageSection,
  TextContent,
  FormGroup,
  Form,
  TextInput,
  ActionGroup,
  Button,
  Divider,
  AlertVariant,
} from "@patternfly/react-core";

import { RoleRepresentation } from "../../model/role-model";
import { HttpClientContext } from "../../http-service/HttpClientContext";
import { useAlerts } from "../../components/alert/Alerts";
import { useForm } from "react-hook-form";
import { RealmContext } from "../../components/realm-context/RealmContext";

export const NewRoleForm = () => {
  const { t } = useTranslation("roles");
  const httpClient = useContext(HttpClientContext)!;
  const [add, Alerts] = useAlerts();
  const { realm } = useContext(RealmContext);

  const { register, handleSubmit } = useForm<RoleRepresentation>();

  const save = async (role: RoleRepresentation) => {
    try {
      await httpClient.doPost(`admin/realms/${realm}/roles`, role);
      add(t("Role created"), AlertVariant.success);
    } catch (error) {
      add(`${t("Could not create role:")} '${error}'`, AlertVariant.danger);
    }
  };

  return (
    <>
      <Alerts />
      <PageSection variant="light">
        <TextContent>
          <Text component="h1">{t("createRole")}</Text>
        </TextContent>
      </PageSection>
      <Divider />
      <PageSection variant="light">
        <Form isHorizontal onSubmit={handleSubmit(save)}>
          <FormGroup label={t("roleName")} isRequired fieldId="kc-role-name">
            <TextInput
              isRequired
              type="text"
              id="kc-role-name"
              name="name"
              ref={register()}
            />
          </FormGroup>
          <FormGroup label={t("description")} fieldId="kc-role-description">
            <TextInput
              type="text"
              id="kc-role-description"
              name="description"
              ref={register()}
            />
          </FormGroup>
          <ActionGroup>
            <Button variant="primary" type="submit">
              {t("common:create")}
            </Button>
            <Button variant="link">{t("common:cancel")}</Button>
          </ActionGroup>
        </Form>
      </PageSection>
    </>
  );
};
