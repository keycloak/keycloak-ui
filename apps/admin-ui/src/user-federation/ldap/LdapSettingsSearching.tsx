import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  Switch,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import type ComponentRepresentation from "@keycloak/keycloak-admin-client/lib/defs/componentRepresentation";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { Controller, UseFormReturn } from "react-hook-form";
import { FormAccess } from "../../components/form-access/FormAccess";
import { WizardSectionHeader } from "../../components/wizard-section-header/WizardSectionHeader";
import { KeycloakTextInput } from "../../components/keycloak-text-input/KeycloakTextInput";

export type LdapSettingsSearchingProps = {
  form: UseFormReturn<ComponentRepresentation>;
  showSectionHeading?: boolean;
  showSectionDescription?: boolean;
};

export const LdapSettingsSearching = ({
  form,
  showSectionHeading = false,
  showSectionDescription = false,
}: LdapSettingsSearchingProps) => {
  const { t } = useTranslation("user-federation");
  const { t: helpText } = useTranslation("user-federation-help");

  const [isSearchScopeDropdownOpen, setIsSearchScopeDropdownOpen] =
    useState(false);
  const [isEditModeDropdownOpen, setIsEditModeDropdownOpen] = useState(false);

  const {
    formState: { errors },
  } = form;

  return (
    <>
      {showSectionHeading && (
        <WizardSectionHeader
          title={t("ldapSearchingAndUpdatingSettings")}
          description={helpText("ldapSearchingAndUpdatingSettingsDescription")}
          showDescription={showSectionDescription}
        />
      )}

      <FormAccess role="manage-realm" isHorizontal>
        <FormGroup
          label={t("editMode")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:editModeLdapHelp"
              fieldLabelId="user-federation:editMode"
            />
          }
          fieldId="kc-edit-mode"
          isRequired
          validated={errors.config?.editMode ? "error" : "default"}
          helperTextInvalid={
            errors.config?.editMode ? t("validateEditMode") : ""
          }
        >
          <Controller
            name="config.editMode.0"
            defaultValue=""
            control={form.control}
            rules={{
              required: true,
            }}
            render={({ field }) => (
              <Select
                toggleId="kc-edit-mode"
                required
                onToggle={() =>
                  setIsEditModeDropdownOpen(!isEditModeDropdownOpen)
                }
                isOpen={isEditModeDropdownOpen}
                onSelect={(_, value) => {
                  field.onChange(value.toString());
                  setIsEditModeDropdownOpen(false);
                }}
                selections={field.value}
                variant={SelectVariant.single}
                validated={errors.config?.editMode ? "error" : "default"}
              >
                <SelectOption value="" isPlaceholder />
                <SelectOption value="READ_ONLY" />
                <SelectOption value="WRITABLE" />
                <SelectOption value="UNSYNCED" />
              </Select>
            )}
          />
        </FormGroup>
        <FormGroup
          label={t("usersDN")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:usersDNHelp"
              fieldLabelId="user-federation:usersDn"
            />
          }
          fieldId="kc-console-users-dn"
          isRequired
          validated={errors.config?.usersDn ? "error" : "default"}
          helperTextInvalid={errors.config?.usersDn ? t("validateUsersDn") : ""}
        >
          <KeycloakTextInput
            isRequired
            type="text"
            defaultValue=""
            id="kc-console-users-dn"
            data-testid="ldap-users-dn"
            validated={errors.config?.usersDn ? "error" : "default"}
            {...form.register("config.usersDn.0", {
              required: true,
            })}
          />
        </FormGroup>
        <FormGroup
          label={t("usernameLdapAttribute")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:usernameLdapAttributeHelp"
              fieldLabelId="user-federation:usernameLdapAttribute"
            />
          }
          fieldId="kc-username-ldap-attribute"
          isRequired
          validated={errors.config?.usernameLDAPAttribute ? "error" : "default"}
          helperTextInvalid={
            errors.config?.usernameLDAPAttribute
              ? t("validateUsernameLDAPAttribute")
              : ""
          }
        >
          <KeycloakTextInput
            isRequired
            type="text"
            defaultValue="cn"
            id="kc-username-ldap-attribute"
            data-testid="ldap-username-attribute"
            validated={
              errors.config?.usernameLDAPAttribute ? "error" : "default"
            }
            {...form.register("config.usernameLDAPAttribute.0", {
              required: true,
            })}
          />
        </FormGroup>
        <FormGroup
          label={t("rdnLdapAttribute")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:rdnLdapAttributeHelp"
              fieldLabelId="user-federation:rdnLdapAttribute"
            />
          }
          fieldId="kc-rdn-ldap-attribute"
          isRequired
          validated={errors.config?.rdnLDAPAttribute ? "error" : "default"}
          helperTextInvalid={
            errors.config?.rdnLDAPAttribute ? t("validateRdnLdapAttribute") : ""
          }
        >
          <KeycloakTextInput
            isRequired
            type="text"
            defaultValue="cn"
            id="kc-rdn-ldap-attribute"
            data-testid="ldap-rdn-attribute"
            validated={errors.config?.rdnLDAPAttribute ? "error" : "default"}
            {...form.register("config.rdnLDAPAttribute.0", {
              required: true,
            })}
          />
        </FormGroup>
        <FormGroup
          label={t("uuidLdapAttribute")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:uuidLdapAttributeHelp"
              fieldLabelId="user-federation:uuidLdapAttribute"
            />
          }
          fieldId="kc-uuid-ldap-attribute"
          isRequired
          validated={errors.config?.uuidLDAPAttribute ? "error" : "default"}
          helperTextInvalid={
            errors.config?.uuidLDAPAttribute
              ? t("validateUuidLDAPAttribute")
              : ""
          }
        >
          <KeycloakTextInput
            isRequired
            type="text"
            defaultValue="objectGUID"
            id="kc-uuid-ldap-attribute"
            data-testid="ldap-uuid-attribute"
            validated={errors.config?.uuidLDAPAttribute ? "error" : "default"}
            {...form.register("config.uuidLDAPAttribute.0", {
              required: true,
            })}
          />
        </FormGroup>
        <FormGroup
          label={t("userObjectClasses")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:userObjectClassesHelp"
              fieldLabelId="user-federation:userObjectClasses"
            />
          }
          fieldId="kc-user-object-classes"
          isRequired
          validated={errors.config?.userObjectClasses ? "error" : "default"}
          helperTextInvalid={
            errors.config?.userObjectClasses
              ? t("validateUserObjectClasses")
              : ""
          }
        >
          <KeycloakTextInput
            isRequired
            type="text"
            defaultValue="person, organizationalPerson, user"
            id="kc-user-object-classes"
            data-testid="ldap-user-object-classes"
            validated={errors.config?.userObjectClasses ? "error" : "default"}
            {...form.register("config.userObjectClasses.0", {
              required: true,
            })}
          />
        </FormGroup>
        <FormGroup
          label={t("userLdapFilter")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:userLdapFilterHelp"
              fieldLabelId="user-federation:userLdapFilter"
            />
          }
          fieldId="kc-user-ldap-filter"
          validated={
            errors.config?.customUserSearchFilter ? "error" : "default"
          }
          helperTextInvalid={
            errors.config?.customUserSearchFilter
              ? t("validateCustomUserSearchFilter")
              : ""
          }
        >
          <KeycloakTextInput
            type="text"
            id="kc-user-ldap-filter"
            data-testid="user-ldap-filter"
            validated={
              errors.config?.customUserSearchFilter ? "error" : "default"
            }
            {...form.register("config.customUserSearchFilter.0", {
              pattern: /(\(.*\))$/,
            })}
          />
        </FormGroup>

        <FormGroup
          label={t("searchScope")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:searchScopeHelp"
              fieldLabelId="user-federation:searchScope"
            />
          }
          fieldId="kc-search-scope"
        >
          <Controller
            name="config.searchScope.0"
            defaultValue=""
            control={form.control}
            render={({ field }) => (
              <Select
                toggleId="kc-search-scope"
                required
                onToggle={() =>
                  setIsSearchScopeDropdownOpen(!isSearchScopeDropdownOpen)
                }
                isOpen={isSearchScopeDropdownOpen}
                onSelect={(_, value) => {
                  field.onChange(value as string);
                  setIsSearchScopeDropdownOpen(false);
                }}
                selections={field.value}
                variant={SelectVariant.single}
              >
                <SelectOption key={0} value="1" isPlaceholder>
                  {t("oneLevel")}
                </SelectOption>
                <SelectOption key={1} value="2">
                  {t("subtree")}
                </SelectOption>
              </Select>
            )}
          ></Controller>
        </FormGroup>
        <FormGroup
          label={t("readTimeout")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:readTimeoutHelp"
              fieldLabelId="user-federation:readTimeout"
            />
          }
          fieldId="kc-read-timeout"
        >
          <KeycloakTextInput
            type="number"
            min={0}
            id="kc-read-timeout"
            data-testid="ldap-read-timeout"
            {...form.register("config.readTimeout.0")}
          />
        </FormGroup>
        <FormGroup
          label={t("pagination")}
          labelIcon={
            <HelpItem
              helpText="user-federation-help:paginationHelp"
              fieldLabelId="user-federation:pagination"
            />
          }
          fieldId="kc-console-pagination"
          hasNoPaddingTop
        >
          <Controller
            name="config.pagination"
            defaultValue={["false"]}
            control={form.control}
            render={({ field }) => (
              <Switch
                id="kc-console-pagination"
                data-testid="console-pagination"
                isDisabled={false}
                onChange={(value) => field.onChange([`${value}`])}
                isChecked={field.value[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
                aria-label={t("pagination")}
              />
            )}
          ></Controller>
        </FormGroup>
      </FormAccess>
    </>
  );
};
