import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useForm } from "react-hook-form";
import {
  ActionGroup,
  Button,
  Dropdown,
  DropdownToggle,
  Form,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core";

import type PolicyProviderRepresentation from "@keycloak/keycloak-admin-client/lib/defs/policyProviderRepresentation";
import useToggle from "../../utils/useToggle";
import { KeycloakTextInput } from "../../components/keycloak-text-input/KeycloakTextInput";

import "./search-dropdown.css";

export type SearchForm = {
  name?: string;
  resource?: string;
  scope?: string;
  type?: string;
  uri?: string;
  owner?: string;
};

type SearchDropdownProps = {
  types?: PolicyProviderRepresentation[] | PolicyProviderRepresentation[];
  search: SearchForm;
  onSearch: (form: SearchForm) => void;
  isResource?: boolean;
};

export const SearchDropdown = ({
  types,
  search,
  onSearch,
  isResource = false,
}: SearchDropdownProps) => {
  const { t } = useTranslation("clients");
  const {
    register,
    control,
    reset,
    formState: { isDirty },
    handleSubmit,
  } = useForm<SearchForm>({ mode: "onChange" });

  const [open, toggle] = useToggle();
  const [typeOpen, toggleType] = useToggle();

  const submit = (form: SearchForm) => {
    toggle();
    onSearch(form);
  };

  useEffect(() => reset(search), [search]);

  const typeOptions = (value: string) => [
    <SelectOption key="empty" value="">
      {t("allTypes")}
    </SelectOption>,
    ...(types || []).map((type) => (
      <SelectOption
        selected={type.type === value}
        key={type.type}
        value={type.type}
      >
        {type.name}
      </SelectOption>
    )),
  ];

  return (
    <Dropdown
      data-testid="searchdropdown_dorpdown"
      className="pf-u-ml-md"
      toggle={
        <DropdownToggle
          onToggle={toggle}
          className="keycloak__client_authentication__searchdropdown"
        >
          {t("searchForPermission")}
        </DropdownToggle>
      }
      isOpen={open}
    >
      <Form
        isHorizontal
        className="keycloak__client_authentication__searchdropdown_form"
        onSubmit={handleSubmit(submit)}
      >
        <FormGroup label={t("common:name")} fieldId="name">
          <KeycloakTextInput
            type="text"
            id="name"
            {...register("name")}
            data-testid="searchdropdown_name"
          />
        </FormGroup>
        {isResource && (
          <>
            <FormGroup label={t("common:type")} fieldId="type">
              <KeycloakTextInput
                type="text"
                id="type"
                {...register("type")}
                data-testid="searchdropdown_type"
              />
            </FormGroup>
            <FormGroup label={t("uris")} fieldId="uri">
              <KeycloakTextInput
                type="text"
                id="uri"
                {...register("uri")}
                data-testid="searchdropdown_uri"
              />
            </FormGroup>
            <FormGroup label={t("owner")} fieldId="owner">
              <KeycloakTextInput
                type="text"
                id="owner"
                {...register("owner")}
                data-testid="searchdropdown_owner"
              />
            </FormGroup>
          </>
        )}
        {!isResource && (
          <FormGroup label={t("resource")} fieldId="resource">
            <KeycloakTextInput
              type="text"
              id="resource"
              {...register("resource")}
              data-testid="searchdropdown_resource"
            />
          </FormGroup>
        )}
        <FormGroup label={t("scope")} fieldId="scope">
          <KeycloakTextInput
            type="text"
            id="scope"
            {...register("scope")}
            data-testid="searchdropdown_scope"
          />
        </FormGroup>
        {!isResource && (
          <FormGroup label={t("common:type")} fieldId="type">
            <Controller
              name="type"
              defaultValue=""
              control={control}
              render={({ field }) => (
                <Select
                  toggleId="type"
                  onToggle={toggleType}
                  onSelect={(event, value) => {
                    event.stopPropagation();
                    field.onChange(value);
                    toggleType();
                  }}
                  selections={field.value || t("allTypes")}
                  variant={SelectVariant.single}
                  aria-label={t("common:type")}
                  isOpen={typeOpen}
                >
                  {field.value ? typeOptions(field.value) : []}
                </Select>
              )}
            />
          </FormGroup>
        )}
        <ActionGroup>
          <Button
            variant="primary"
            type="submit"
            data-testid="search-btn"
            isDisabled={!isDirty}
          >
            {t("common:search")}
          </Button>
          <Button
            variant="link"
            data-testid="revert-btn"
            onClick={() => onSearch({})}
          >
            {t("common:clear")}
          </Button>
        </ActionGroup>
      </Form>
    </Dropdown>
  );
};
