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
  ExpandableSection,
  SplitItem,
  Split,
  SelectGroup,
  Divider,
} from "@patternfly/react-core";
import { Controller, useForm, useFormContext } from "react-hook-form";

import { FormAccess } from "../../components/form-access/FormAccess";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import type { ClientForm } from "../ClientDetails";
import { FormPanel } from "../../components/scroll-form/FormPanel";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import type RoleRepresentation from "@keycloak/keycloak-admin-client/lib/defs/roleRepresentation";
import { useAdminClient } from "../../context/auth/AdminClient";
import type ResourceEvaluation from "@keycloak/keycloak-admin-client/lib/defs/resourceEvaluation";
import { useRealm } from "../../context/realm-context/RealmContext";
// import type { MultiLine } from "../../components/multi-line-input/multi-line-convert";

type AttributeType = {
  key: string;
  name: string;
  custom?: boolean;
  values?: {
    [key: string]: string;
  }[];
};

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
  // save,
  reset,
}: ClientSettingsProps) => {
  const { control } = useFormContext<ClientForm>();
  const form = useForm<ResourceEvaluation>({ mode: "onChange" });
  const { t } = useTranslation("clients");
  const adminClient = useAdminClient();
  const realm = useRealm();

  const [clientsDropdownOpen, setClientsDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [keyOpen, setKeyOpen] = useState(false);
  const [valueOpen, setValueOpen] = useState(false);
  const [selectedAttribute, setSelectedAttribute] = useState<AttributeType>();

  const defaultContextAttributes = [
    {
      key: "custom",
      name: "Custom Attribute...",
      custom: true,
    },
    {
      key: "kc.identity.authc.method",
      name: "Authentication Method",
      values: [
        {
          key: "pwd",
          name: "Password",
        },
        {
          key: "otp",
          name: "One-Time Password",
        },
        {
          key: "kbr",
          name: "Kerberos",
        },
      ],
    },
    {
      key: "kc.realm.name",
      name: "Realm",
    },
    {
      key: "kc.time.date_time",
      name: "Date/Time (MM/dd/yyyy hh:mm:ss)",
    },
    {
      key: "kc.client.network.ip_address",
      name: "Client IPv4 Address",
    },
    {
      key: "kc.client.network.host",
      name: "Client Host",
    },
    {
      key: "kc.client.user_agent",
      name: "Client/User Agent",
    },
  ];

  const evaluate = () => {
    const formValues = form.getValues();
    console.log(formValues);
    const resEval: ResourceEvaluation = {
      rolesIds: formValues.rolesIds ?? [],
      userId: users.find((user) => user.username === formValues.userId)?.id!,
      entitlements: false,
      context: formValues.context,
    };
    return adminClient.clients.evaluateResource(
      { id: clientId!, realm: realm.realm },
      resEval
    );
  };

  const attributeSelectOptions = () => {
    const createItem = (attributeType: {
      key: string;
      name: string;
      custom?: boolean;
      values?: {
        key: string;
        name: string;
      }[];
    }) => (
      <SelectOption key={attributeType.name} value={attributeType}>
        {attributeType.name}
      </SelectOption>
    );
    return defaultContextAttributes.map((attribute) => createItem(attribute));
  };

  const createAuthenticationMethodMenu = () => {
    return [
      <SelectGroup key="role" label={t("roleGroup")}>
        <SelectOption key="realmRoles" value={"test"}>
          {attributeSelectOptions()}
        </SelectOption>
      </SelectGroup>,
      <Divider key="divider" />,
      <SelectGroup key="group" label={t("clientGroup")}>
        {defaultContextAttributes[1].values!.map((attribute) => (
          <SelectOption key={attribute.name} value={attribute}>
            {attribute.name}
          </SelectOption>
        ))}
      </SelectGroup>,
    ];
  };

  const onClear = (onChange: (value: string) => void) => {
    setSelectedAttribute(undefined);
    // setSelectedRole(undefined);
    onChange("");
  };

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
              name="rolesIds"
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
          <ExpandableSection
            toggleText={t("contextualInfo")}
            onToggle={() => setIsExpanded(!isExpanded)}
            isExpanded={isExpanded}
          >
            <FormGroup
              label={t("contextualAttributes")}
              labelIcon={
                <HelpItem
                  helpText={t("clients-help:contextualAttributes")}
                  fieldLabelId={`contextualAttributes`}
                />
              }
              // validated={
              //   form.errors[selectedAttribute?.key] ? "error" : "default"
              // }
              helperTextInvalid={t("common:required")}
              fieldId={name!}
            >
              <Controller
                name={"test"}
                defaultValue=""
                control={control}
                render={({ onChange }) => (
                  <Split hasGutter>
                    <SplitItem>
                      {/* {selectedAttribute?.name === "Authentication Method" && ( */}
                      <Select
                        toggleId={`group-${name}`}
                        onToggle={() => setKeyOpen(!keyOpen)}
                        isOpen={keyOpen}
                        variant={SelectVariant.typeahead}
                        typeAheadAriaLabel={t("selectASourceOfRoles")}
                        placeholderText={t("selectASourceOfRoles")}
                        isGrouped
                        onFilter={() => {
                          return attributeSelectOptions();
                        }}
                        selections={selectedAttribute?.name}
                        onClear={() => onClear(onChange)}
                        onSelect={(_, value) => {
                          onClear(onChange);
                          console.log(value);
                          setSelectedAttribute(value as AttributeType);
                          setKeyOpen(false);
                        }}
                      >
                        {attributeSelectOptions()}
                      </Select>
                      {/* )} */}
                    </SplitItem>
                    <SplitItem>
                      {selectedAttribute?.name === "Authentication Method" && (
                        <Select
                          toggleId={`role-${name}`}
                          onToggle={(isExpanded) => setValueOpen(isExpanded)}
                          isOpen={valueOpen}
                          variant={SelectVariant.typeahead}
                          // placeholderText={
                          //   selectedAttribute?.name !== "realmRoles"
                          //     ? t("clientRoles")
                          //     : t("selectARole")
                          // }
                          // isDisabled={!selectedClient}
                          typeAheadAriaLabel={t("selectARole")}
                          selections={selectedAttribute.name}
                          onSelect={(_, value) => {
                            const attribute = value as AttributeType;
                            setSelectedAttribute(attribute);
                            // onChange(
                            //   selectedAttribute?.key === "realmRoles"
                            //     ? role.name
                            //     : `${selectedClient?.clientId}.${role.name}`
                            // );
                            setValueOpen(false);
                          }}
                          maxHeight={200}
                          // onClear={() => onClear(onChange)}
                        >
                          {createAuthenticationMethodMenu()}
                        </Select>
                      )}
                    </SplitItem>
                  </Split>
                )}
              />
            </FormGroup>
          </ExpandableSection>
        </FormAccess>
        <ActionGroup>
          <Button data-testid="authorization-eval" onClick={evaluate}>
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
