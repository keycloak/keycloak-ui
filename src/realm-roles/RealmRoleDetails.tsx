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
// import { MapperList } from "../details/MapperList";

export const RolesForm = () => {
  const { t } = useTranslation("client-scopes");
  const { register, control, handleSubmit, errors, setValue } = useForm<
    RoleRepresentation
  >();
  const history = useHistory();
  const [role, setRole] = useState<RoleRepresentation>();
  const [name, setName] = useState("");
  const [activeTab, setActiveTab] = useState(0);

  const httpClient = useContext(HttpClientContext)!;
  const { realm } = useContext(RealmContext);
  const providers = useLoginProviders();
  const { id } = useParams<{ id: string }>();

  const [open, isOpen] = useState(false);
  const { addAlert } = useAlerts();
  const url = `/admin/realms/${realm}/roles/${id}`;

  const form = useForm();

  console.log("name", name)


  useEffect(() => {
    (async () => {
      const fetchedRole = await httpClient.doGet<RoleRepresentation>(url);
      if (fetchedRole.data) {
        // setRole(fetchedRole.data);
        setName(fetchedRole.data.name!)
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

  const save = async (roles: RoleRepresentation) => {
    try {
      roles.attributes = convertFormValuesToObject(
        roles.attributes!
      );

      const url = `/admin/realms/${realm}/roles/`;
      if (id) {
        await httpClient.doPut(url + id, roles);
      } else {
        await httpClient.doPost(url, roles);
      }
      addAlert(t((id ? "update" : "create") + "Success"), AlertVariant.success);
    } catch (error) {
      addAlert(
        t((id ? "update" : "create") + "Error", { error }),
        AlertVariant.danger
      );
    }
  };

  return (
    <>
      <ViewHeader
        titleKey={
          name!
        }
        subKey="client-scopes:clientScopeExplain"
        // badge={roles ? roles.protocol : undefined}
      />

      <PageSection variant="light">
        <Tabs
          activeKey={activeTab}
          onSelect={(_, key) => setActiveTab(key as number)}
          isBox
        >
          <Tab
            eventKey={0}
            title={<TabTitleText>{t("Details")}</TabTitleText>}
          >
            <Form isHorizontal onSubmit={handleSubmit(save)}>
              <FormGroup
                label={t("Role name")}
                labelIcon={
                  <HelpItem
                    helpText="client-scopes-help:name"
                    forLabel={t("name")}
                    forID="kc-name"
                  />
                }
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
                />
              </FormGroup>
              <FormGroup
                label={t("description")}
                labelIcon={
                  <HelpItem
                    helpText="client-scopes-help:description"
                    forLabel={t("description")}
                    forID="kc-description"
                  />
                }
                fieldId="kc-description"
              >
                <TextInput
                  ref={register}
                  type="text"
                  id="kc-description"
                  name="description"
                />
              </FormGroup>
              {!id && (
                <FormGroup
                  label={t("protocol")}
                  labelIcon={
                    <HelpItem
                      helpText="client-scopes-help:protocol"
                      forLabel="protocol"
                      forID="kc-protocol"
                    />
                  }
                  fieldId="kc-protocol"
                >
                  <Controller
                    name="protocol"
                    defaultValue=""
                    control={control}
                    render={({ onChange, value }) => (
                      <Select
                        toggleId="kc-protocol"
                        required
                        onToggle={() => isOpen(!open)}
                        onSelect={(_, value, isPlaceholder) => {
                          onChange(isPlaceholder ? "" : (value as string));
                          isOpen(false);
                        }}
                        selections={value}
                        variant={SelectVariant.single}
                        aria-label={t("selectEncryptionType")}
                        placeholderText={t("common:selectOne")}
                        isOpen={open}
                      >
                        {providers.map((option) => (
                          <SelectOption
                            selected={option === value}
                            key={option}
                            value={option}
                          />
                        ))}
                      </Select>
                    )}
                  />
                </FormGroup>
              )}
              <ActionGroup>
                <Button variant="primary" type="submit">
                  {t("common:save")}
                </Button>
                <Button
                  variant="link"
                  onClick={() => history.push("/roles/")}
                >
                  {t("common:cancel")}
                </Button>
              </ActionGroup>
            </Form>
          </Tab>
          <Tab eventKey={1} title={<TabTitleText>{t("Attributes")}</TabTitleText>}>
          <Form isHorizontal onSubmit={handleSubmit(save)}>
              <FormGroup
                label={t("Key")}
                labelIcon={
                  <HelpItem
                    helpText="client-scopes-help:name"
                    forLabel={t("name")}
                    forID="kc-name"
                  />
                }
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
                />
              </FormGroup>
              <FormGroup
                label={t("Value")}
                labelIcon={
                  <HelpItem
                    helpText="client-scopes-help:description"
                    forLabel={t("description")}
                    forID="kc-description"
                  />
                }
                fieldId="kc-description"
              >
                <TextInput
                  ref={register}
                  type="text"
                  id="kc-description"
                  name="description"
                />
              </FormGroup>
              {!id && (
                <FormGroup
                  label={t("protocol")}
                  labelIcon={
                    <HelpItem
                      helpText="client-scopes-help:protocol"
                      forLabel="protocol"
                      forID="kc-protocol"
                    />
                  }
                  fieldId="kc-protocol"
                >
                  <Controller
                    name="protocol"
                    defaultValue=""
                    control={control}
                    render={({ onChange, value }) => (
                      <Select
                        toggleId="kc-protocol"
                        required
                        onToggle={() => isOpen(!open)}
                        onSelect={(_, value, isPlaceholder) => {
                          onChange(isPlaceholder ? "" : (value as string));
                          isOpen(false);
                        }}
                        selections={value}
                        variant={SelectVariant.single}
                        aria-label={t("selectEncryptionType")}
                        placeholderText={t("common:selectOne")}
                        isOpen={open}
                      >
                        {providers.map((option) => (
                          <SelectOption
                            selected={option === value}
                            key={option}
                            value={option}
                          />
                        ))}
                      </Select>
                    )}
                  />
                </FormGroup>
              )}
              <ActionGroup>
                <Button variant="primary" type="submit">
                  {t("common:save")}
                </Button>
                <Button
                  variant="link"
                  onClick={() => history.push("/roles/")}
                >
                  {t("common:cancel")}
                </Button>
              </ActionGroup>
            </Form>            </Tab>
            <Tab eventKey={2} title={<TabTitleText>{t("Users in Role")}</TabTitleText>} />
        </Tabs>
      </PageSection>
    </>
  );
};
