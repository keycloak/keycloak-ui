import React, { useState, FormEvent, useContext } from "react";
import { useTranslation } from "react-i18next";
import {
  Text,
  PageSection,
  TextContent,
  FormGroup,
  Form,
  TextInput,
  Switch,
  ActionGroup,
  Button,
  Divider,
  AlertVariant,
  TextArea
} from "@patternfly/react-core";

// import { JsonFileUpload } from "../../components/json-file-upload/JsonFileUpload";
import { RoleRepresentation } from "../../model/role-model";
import { HttpClientContext } from "../../http-service/HttpClientContext";
import { useAlerts } from "../../components/alert/Alerts";
import { useForm, Controller } from "react-hook-form";
import { RealmContext } from "../../components/realm-context/RealmContext";


export const NewRoleForm = () => {
  const { t } = useTranslation("roles");
  const httpClient = useContext(HttpClientContext)!;
  const [add, Alerts] = useAlerts();
  const { realm } = useContext(RealmContext);

  const { register, handleSubmit, setValue, control } = useForm<
  RoleRepresentation
  >();

//   const handleFileChange = (value: string | File) => {
//     const defaultRealm = { id: "", realm: "", enabled: true };

//     const obj = value ? JSON.parse(value as string) : defaultRealm;
//     Object.keys(obj).forEach((k) => {
//       setValue(k, obj[k]);
//     });
//   };

  const save = async (role: RoleRepresentation) => {
    try {
      await httpClient.doPost(`/auth/admin/realms/${realm}/roles`, role);
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
          {/* <JsonFileUpload id="kc-realm-filename" onChange={handleFileChange} /> */}
          <FormGroup label={t("roleName")} isRequired fieldId="kc-role-name">
            <TextInput
              isRequired
              type="text"
              id="kc-role-name"
              name="role"
              ref={register()}
            />
          </FormGroup>
          <FormGroup label={t("description")} fieldId="kc-role-description">
            <TextArea
              type="text"
              id="kc-role-name"
              name="role"
              ref={register()}
            />
          </FormGroup>
          <ActionGroup>
            <Button variant="primary" type="submit">
              {t("create")}
            </Button>
            <Button variant="link">{t("common:cancel")}</Button>
          </ActionGroup>
        </Form>
      </PageSection>
    </>
  );
};
