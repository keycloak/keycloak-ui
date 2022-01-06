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
  // SplitItem,
  // Split,
  // SelectGroup,
  // Divider,
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
// import { MultiLineInput } from "../../components/multi-line-input/MultiLineInput";
import { AttributeInput } from "../../components/attribute-input/AttributeInput";
// import { defaultContextAttributes } from "../utils";

export type AttributeType = {
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
  // const [keyOpen, setKeyOpen] = useState(false);
  // const [valueOpen, setValueOpen] = useState(false);
  // const [selectedAttribute, setSelectedAttribute] = useState<AttributeType[]>(
  //   []
  // );
  // const [isValueSelectable, setIsValueSelectable] = useState(false);

  console.log("u", users);
  console.log("c", clients);

  const evaluate = () => {
    const formValues = form.getValues();
    console.log(formValues);
    const resEval: ResourceEvaluation = {
      rolesIds: formValues.rolesIds ?? [],
      userId: users.find((user) => user.username === formValues.userId)?.id!,
      entitlements: false,
      context: formValues.context,
      // clientId: clients.find(
      //   (client) => client.clientId === formValues.clientId
      // )?.id!,
    };
    return adminClient.clients.evaluateResource(
      { id: clientId!, realm: realm.realm },
      resEval
    );
  };

  // const onClear = (onChange: (value: string) => void) => {
  //   setSelectedAttribute([]);
  //   onChange("");
  // };

  // const attributeSelectOptions = () => {
  //   const createItem = (attributeType: {
  //     key: string;
  //     name: string;
  //     custom?: boolean;
  //     values?: {
  //       key: string;
  //       name: string;
  //     }[];
  //   }) => (
  //     <SelectOption key={attributeType.name} value={attributeType}>
  //       {attributeType.name}
  //     </SelectOption>
  //   );
  //   return defaultContextAttributes.map((attribute) => createItem(attribute));
  // };

  // const a = () => {
  //   return [
  //     <SelectGroup key="role">
  //       <SelectOption key="realmRoles" value={selectedAttribute}>
  //         {attributeSelectOptions()}
  //       </SelectOption>
  //     </SelectGroup>,
  //   ];
  // };

  // const b = () => {
  //   return [
  //     <SelectGroup key="group">
  //       {defaultContextAttributes[1].values!.map((attribute) => (
  //         <SelectOption key={attribute.name} value={attribute}>
  //           {attribute.name}
  //         </SelectOption>
  //       ))}
  //     </SelectGroup>,
  //   ];
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
            isRequired
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
            isRequired
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
            label={t("roles")}
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
              {/* <Controller
                name={"context.attributes"}
                defaultValue=""
                control={control}
                render={({ onChange }) => (
                  <Split hasGutter>
                    <SplitItem>
                      <Select
                        toggleId={`group-${name}`}
                        onToggle={() => setKeyOpen(!keyOpen)}
                        isOpen={keyOpen}
                        variant={SelectVariant.typeahead}
                        typeAheadAriaLabel={t("selectOrTypeAKey")}
                        placeholderText={t("selectOrTypeAKey")}
                        isGrouped
                        onFilter={() => {
                          return attributeSelectOptions();
                        }}
                        selections={selectedAttribute}
                        onClear={() => onClear(onChange)}
                        onSelect={(_, value) => {
                          // onClear(onChange);
                          setSelectedAttribute([value as AttributeType]);
                          console.log(selectedAttribute);
                          setKeyOpen(false);
                        }}
                      >
                        {defaultContextAttributes.map((attribute) => (
                          <SelectOption
                            selected={
                              attribute.name === selectedAttribute[0]?.name
                            }
                            key={attribute.name}
                            value={attribute.name}
                          />
                        ))}
                      </Select>
                    </SplitItem>
                    <SplitItem>
                      {selectedAttribute[0]?.toString() ===
                      "Authentication Method" ? (
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
                          selections={authenticationMethod || ""}
                          onSelect={(_, value) => {
                            const authMethod = value as AttributeType;
                            setAuthenticationMethod(authMethod.name.toString());
                            setValueOpen(false);
                          }}
                          maxHeight={200}
                          // onClear={() => onClear(onChange)}
                        >
                          {b()}
                        </Select>
                      ) : (
                        <MultiLineInput
                          name="redirectUris"
                          aria-label={t("validRedirectUri")}
                          addButtonLabel="clients:addRedirectUri"
                        />
                      )}
                    </SplitItem>
                  </Split>
                )}
              /> */}
              <AttributeInput isKeySelectable name="context" />
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
