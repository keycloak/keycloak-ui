import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  ActionGroup,
  AlertVariant,
  Button,
  Form,
  FormGroup,
  PageSection,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
  Tab,
  Tabs,
  TabTitleText,
  TextArea,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";

// import { ClientScopeRepresentation } from "../models/client-scope";
import { HelpItem } from "../components/help-enabler/HelpItem";
import { HttpClientContext } from "../context/http-service/HttpClientContext";
import { RealmContext } from "../context/realm-context/RealmContext";
import { useAlerts } from "../components/alert/Alerts";
import { useLoginProviders } from "../context/server-info/ServerInfoProvider";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { convertFormValuesToObject, convertToFormValues } from "../util";
import { RoleRepresentation } from "../model/role-model";
import {
  convertToMultiline,
  toValue,
} from "../components/multi-line-input/MultiLineInput";
import { useAdminClient } from "../context/auth/AdminClient";
// import { MapperList } from "../details/MapperList";

export const RolesForm = () => {
  const { t } = useTranslation("client-scopes");
  const { register, control, handleSubmit, errors, setValue } = useForm<
    RoleRepresentation
  >();
  const history = useHistory();
  const [role, setRole] = useState<RoleRepresentation>();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [value, setValue] = React.useState({ name });
  const [activeTab, setActiveTab] = useState(0);

  // const httpClient = useContext(HttpClientContext)!;
  const adminClient = useAdminClient();

  const { realm } = useContext(RealmContext);
  const providers = useLoginProviders();
  const { id } = useParams<{ id: string }>();

  const [open, isOpen] = useState(false);
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

  const save = async () => {
    if (await form.trigger()) {
      try {
        const role = {
          ...form.getValues(),
        };

        console.log("getvalues", form.getValues());
        //await httpClient.doPut(url, role);

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
            <Form isHorizontal onSubmit={handleSubmit(save)}>
              <FormGroup
                label={t("Role name")}
                fieldId="kc-name"
                isRequired
                validated={errors.name ? "error" : "default"}
                helperTextInvalid={t("common:required")}
              >
                <TextInput
                  ref={register({ required: true })}
                  type="text"
                  id="kc-name"
                  name="name"
                  value={name}
                  onChange={(value) => setValue(value)}
                />
              </FormGroup>
              <FormGroup label={t("description")} fieldId="kc-description">
                <TextArea
                  ref={register}
                  type="text"
                  id="kc-description"
                  defaultValue={description}
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
            </Form>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};
