import React, { useContext, useState, useEffect } from "react";
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
  TextArea,
  ValidatedOptions,
} from "@patternfly/react-core";

import { RoleRepresentation } from "../model/role-model";
import { HttpClientContext } from "../context/http-service/HttpClientContext";
import { useHistory, useParams } from "react-router-dom";
import { useAlerts } from "../components/alert/Alerts";
import { Controller, useForm } from "react-hook-form";
import { RealmContext } from "../context/realm-context/RealmContext";
import { convertToMultiline } from "../components/multi-line-input/MultiLineInput";

export const RealmRoleDetails = () => {
  const { t } = useTranslation("roles");
  const httpClient = useContext(HttpClientContext)!;
  const history = useHistory();
  const { addAlert } = useAlerts();
  const { realm } = useContext(RealmContext);
  const { id } = useParams<{ id: string }>();
  const [name, setName] = useState("");
  const form = useForm();
  const url = `/admin/realms/${realm}/realm-roles/${id}`;

  const { register, control, errors, handleSubmit } = useForm<
    RoleRepresentation
  >();

  const save = async (role: RoleRepresentation) => {
    try {
      await httpClient.doPost(`admin/realms/${realm}/realm-roles`, role);
      addAlert(t("roleCreated"), AlertVariant.success);
    } catch (error) {
      addAlert(`${t("roleCreateError")} '${error}'`, AlertVariant.danger);
    }
  };

  useEffect(() => {
    (async () => {
      const fetchedRole = await httpClient.doGet<RoleRepresentation>(url);
      console.log("data", fetchedRole.data);
      console.log("typeof data", typeof fetchedRole.data);

      if (fetchedRole.data) {
        setName(fetchedRole.data.id);
        Object.entries(fetchedRole.data).map((entry) => {
          if (entry[0] !== "redirectUris") {
            form.setValue(entry[0], entry[1]);
          } else if (entry[1] && entry[1].length > 0) {
            form.setValue(entry[0], convertToMultiline(entry[1]));
          }
        });
      }
    })();
  }, []);

  return (
    <>
      <PageSection variant="light">
        <TextContent>
          <Text component="h1"></Text>
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
          <FormGroup
            label={t("description")}
            fieldId="kc-role-description"
            helperTextInvalid="Max length 255"
            validated={
              errors ? ValidatedOptions.error : ValidatedOptions.default
            }
          >
            <Controller
              name="description"
              defaultValue=""
              control={control}
              rules={{ maxLength: 255 }}
              render={({ onChange, value }) => (
                <TextArea
                  type="text"
                  id="kc-role-description"
                  value={value}
                  onChange={onChange}
                />
              )}
            />
          </FormGroup>
          <ActionGroup>
            <Button
              variant="primary"
              type="submit"
              onClick={() => history.push(`/role-details`)}
            >
              {t("common:create")}
            </Button>
            <Button variant="link">{t("common:cancel")}</Button>
          </ActionGroup>
        </Form>
      </PageSection>
    </>
  );
};
