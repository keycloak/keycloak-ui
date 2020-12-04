import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  ActionGroup,
  Button,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useForm, UseFormMethods } from "react-hook-form";
import { FormAccess } from "../components/form-access/FormAccess";
import "./RealmRolesSection.css";
import { useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import { KeyValueInput } from "./KeyValueInput";

type RoleAttributesProps = {
    form: UseFormMethods;
    save: () => void;
  };

export const RoleAttributes = ({form, save}: RoleAttributesProps) => {
  const { t } = useTranslation("roles");
  const {  handleSubmit, setValue } = useForm<
    RoleRepresentation
  >();
  const history = useHistory();
  const [, setName] = useState("");

  const adminClient = useAdminClient();

  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    (async () => {
      const fetchedRole = await adminClient.roles.findOneById({ id });
      setName(fetchedRole.name!);
      setupForm(fetchedRole);
    })();
  }, []);

  const setupForm = (role: RoleRepresentation) => {
    Object.entries(role).map((entry) => {
      setValue(entry[0], entry[1]);
    });
  };

  return (
    <>
            <FormAccess
              onSubmit={handleSubmit(save)}
              role="manage-realm"
              className="pf-u-mt-lg"
            >
            <KeyValueInput form={form} name="redirectUris" />
              <ActionGroup>
                <Button variant="primary" type="submit">
                  {t("common:save")}
                </Button>
                <Button variant="link" onClick={() => history.push("/roles/")}>
                  {t("common:reload")}
                </Button>
              </ActionGroup>
            </FormAccess>
    </>
  );
};
