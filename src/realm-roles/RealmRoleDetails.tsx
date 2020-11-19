import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  ActionGroup,
  AlertVariant,
  Button,
  FormGroup,
  PageSection,
  Tab,
  Tabs,
  TabTitleText,
  TextArea,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import { FormAccess } from "../components/form-access/FormAccess";

import { useAlerts } from "../components/alert/Alerts";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { convertToFormValues } from "../util";
import { RoleRepresentation } from "../model/role-model";
import { useAdminClient } from "../context/auth/AdminClient";
// import { MapperList } from "../details/MapperList";

export const RolesForm = () => {
  const { t } = useTranslation("client-scopes");
  const { register, handleSubmit, errors } = useForm<RoleRepresentation>();
  const history = useHistory();
  // const [role, setRole] = useState<RoleRepresentation>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  // const httpClient = useContext(HttpClientContext)!;
  const adminClient = useAdminClient();

  // const { realm } = useContext(RealmContext);
  // const providers = useLoginProviders();
  const { id } = useParams<{ id: string }>();

  // const [open, isOpen] = useState(false);
  const { addAlert } = useAlerts();
  // const url = `/admin/realms/${realm}/roles-by-id/${id}`;

  const form = useForm();

  useEffect(() => {
    (async () => {
      // const fetchedRole = await httpClient.doGet<RoleRepresentation>(url);
      const fetchedRole = await adminClient.roles.findOneById({ id });
      const fetchedDescription = fetchedRole?.description;
      if (fetchedRole) {
        setName(fetchedRole.name!);
        setupForm(fetchedRole);
        setDescription(fetchedDescription!);
      }
    })();
  }, []);

  console.log("name", name);
  console.log("description", description);

  const setupForm = (role: RoleRepresentation) => {
    form.reset(role);
    Object.entries(role).map((entry) => {
        form.setValue(entry[0], entry[1]);
    });
  };

  const save = async (role: RoleRepresentation) => {
    if (await form.trigger()) {
      try {
        const role = {
          ...form.getValues(),
          // attributes
        };

        console.log("getvalues", form.getValues());

        await adminClient.roles.updateByName({ name }, role);
        setupForm(role as RoleRepresentation);
        addAlert(t("roleSaveSuccess"), AlertVariant.success);
      } catch (error) {
        addAlert(`${t("roleSaveError")} '${error}'`, AlertVariant.danger);
      }
    }
  };

  return (
    <>
      <ViewHeader titleKey={name} subKey="" />

      <PageSection variant="light">
        <Tabs
          activeKey={activeTab}
          onSelect={(_, key) => setActiveTab(key as number)}
          isBox
        >
          <Tab eventKey={0} title={<TabTitleText>{t("Details")}</TabTitleText>}>
            <FormAccess
              isHorizontal
              onSubmit={handleSubmit(save)}
              role="manage-realm"
              className="pf-u-mt-lg"
            >
              <FormGroup
                label={t("Role name")}
                fieldId="kc-name"
                isRequired
                validated={errors.name ? "error" : "default"}
                helperTextInvalid={t("common:required")}
              >
                {name ? (
                  <TextInput
                    ref={register({ required: true })}
                    type="text"
                    id="kc-name"
                    name="name"
                    defaultValue={name}
                  />
                ) : undefined}
              </FormGroup>
              <FormGroup label={t("description")} fieldId="kc-description">
                <Controller
                  name="description"
                  defaultValue=""
                  control={form.control}
                  rules={{ maxLength: 255 }}
                  render={({ onChange, value }) => (
                    <TextArea
                      type="text"
                      validated={
                        errors.description
                          ? ValidatedOptions.error
                          : ValidatedOptions.default
                      }
                      id="kc-role-description"
                      value={value}
                      onChange={onChange}
                    />
                  )}
                />
              </FormGroup>
              <ActionGroup>
                <Button variant="primary" type="submit">
                  {t("common:save")}
                </Button>
                <Button variant="link" onClick={() => history.push("/roles/")}>
                  {t("common:reload")}
                </Button>
              </ActionGroup>
            </FormAccess>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};
