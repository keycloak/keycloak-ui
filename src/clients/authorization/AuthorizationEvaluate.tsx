import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  Select,
  SelectVariant,
  SelectOption,
  PageSection,
  ActionGroup,
  Button,
  Switch,
} from "@patternfly/react-core";
import { Controller, useForm, useFormContext } from "react-hook-form";

import { FormAccess } from "../../components/form-access/FormAccess";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import type { ClientForm } from "../ClientDetails";
import { FormPanel } from "../../components/scroll-form/FormPanel";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
// import { useAdminClient } from "../../context/auth/AdminClient";
// import type ResourceEvaluation from "@keycloak/keycloak-admin-client/lib/defs/resourceEvaluation";
// import { useRealm } from "../../context/realm-context/RealmContext";

type ClientSettingsProps = {
  clients: ClientRepresentation[];
  clientId?: string;
  save: () => void;
  reset: () => void;
  users: UserRepresentation[];
  clientRoles: RoleRepresentation[];
};

export const AuthorizationEvaluate = ({
  clients,
  clientRoles,
  clientId,
  users,
  save,
  reset,
}: ClientSettingsProps) => {
  const { control } = useFormContext<ClientForm>();
  const form = useForm<ClientRepresentation>({ mode: "onChange" });
  const { t } = useTranslation("clients");
  // const adminClient = useAdminClient();
  // const realm = useRealm();

  const [clientsDropdownOpen, setClientsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);

  // const evaluate = (resEval: ResourceEvaluation) => {
  //   return adminClient.clients.evaluateResource(
  //     { id: clientId!, realm: realm.realm },
  //     resEval
  //   );
  // };

  return (
    <PageSection>
      <FormPanel
        className="kc-identity-information"
        title={t("identityInformation")}
      >
        <FormAccess isHorizontal role="manage-clients">
          <FormGroup
            label={t("client")}
            labelIcon={
              <HelpItem
                helpText="clients-help:client"
                fieldLabelId="clients:client"
              />
            }
            fieldId="client"
          >
            <Controller
              name="client"
              defaultValue={clientId}
              control={form.control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="client"
                  onToggle={setClientsDropdownOpen}
                  onSelect={(_, value) => {
                    onChange(value.toString());
                    setClientsDropdownOpen(false);
                  }}
                  selections={value}
                  variant={SelectVariant.typeahead}
                  aria-label={t("client")}
                  isOpen={clientsDropdownOpen}
                >
                  {clients.map((client) => (
                    <SelectOption
                      selected={client.clientId === value}
                      key={client.clientId}
                      value={client.clientId}
                    />
                  ))}
                </Select>
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("user")}
            labelIcon={
              <HelpItem
                helpText="clients-help:userSelect"
                fieldLabelId="clients:userSelect"
              />
            }
            fieldId="loginTheme"
          >
            <Controller
              name="userId"
              defaultValue=""
              control={form.control}
              render={({ onChange, value }) => (
                <Select
                  toggleId="user"
                  placeholderText={t("selectAUser")}
                  onToggle={setUserDropdownOpen}
                  onSelect={(_, value) => {
                    onChange(value.toString());
                    setUserDropdownOpen(false);
                  }}
                  selections={value}
                  variant={SelectVariant.typeahead}
                  aria-label={t("user")}
                  isOpen={userDropdownOpen}
                >
                  {users.map((user) => (
                    <SelectOption
                      selected={user.username === value}
                      key={user.username}
                      value={user.username}
                    />
                  ))}
                </Select>
              )}
            />
          </FormGroup>
          <FormGroup
            label={t("realmRole")}
            labelIcon={
              <HelpItem
                helpText="clients-help:roles"
                fieldLabelId="clients:roles"
              />
            }
            fieldId="realmRole"
          >
            <Controller
              name="roleIds"
              placeholderText={t("selectARole")}
              control={form.control}
              defaultValue={[]}
              render={({ onChange, value }) => (
                <Select
                  variant={SelectVariant.typeaheadMulti}
                  toggleId="role"
                  onToggle={setRoleDropdownOpen}
                  selections={value}
                  onSelect={(_, v) => {
                    const option = v.toString();
                    if (value.includes(option)) {
                      onChange(value.filter((item: string) => item !== option));
                    } else {
                      onChange([...value, option]);
                    }
                  }}
                  onClear={(event) => {
                    event.stopPropagation();
                    onChange([]);
                  }}
                  aria-label={t("realmRole")}
                  isOpen={roleDropdownOpen}
                >
                  {clientRoles.map((role) => (
                    <SelectOption
                      selected={role.name === value}
                      key={role.name}
                      value={role.name}
                    />
                  ))}
                </Select>
              )}
            />
          </FormGroup>
        </FormAccess>
      </FormPanel>
      <FormPanel className="kc-permissions" title={t("permissions")}>
        <FormAccess isHorizontal role="manage-clients">
          <FormGroup
            label={t("applyToResourceType")}
            fieldId="applyToResourceType"
            labelIcon={
              <HelpItem
                helpText="clients-help:applyToResourceType"
                fieldLabelId="clients:applyToResourceType"
              />
            }
          >
            <Controller
              name="applyToResource"
              defaultValue=""
              control={control}
              render={({ onChange, value }) => (
                <Switch
                  id="applyToResource-switch"
                  label={t("common:on")}
                  labelOff={t("common:off")}
                  isChecked={value === "true"}
                  onChange={(value) => onChange("" + value)}
                />
              )}
            />
          </FormGroup>
        </FormAccess>
        <ActionGroup>
          <Button data-testid="authorization-eval" onClick={save}>
            {t("evaluate")}
          </Button>
          <Button
            data-testid="authorization-revert"
            variant="link"
            onClick={reset}
          >
            {t("common:revert")}
          </Button>
          <Button
            data-testid="authorization-revert"
            variant="primary"
            onClick={reset}
            isDisabled
          >
            {t("lastEvaluation")}
          </Button>
        </ActionGroup>
      </FormPanel>
    </PageSection>
  );
};
