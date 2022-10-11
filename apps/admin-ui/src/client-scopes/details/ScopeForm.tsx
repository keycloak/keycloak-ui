import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom-v5-compat";
import { useTranslation } from "react-i18next";
import { Controller, useForm, useWatch } from "react-hook-form";
import {
  FormGroup,
  ValidatedOptions,
  Select,
  SelectVariant,
  SelectOption,
  Switch,
  ActionGroup,
  Button,
} from "@patternfly/react-core";

import {
  clientScopeTypesSelectOptions,
  allClientScopeTypes,
  ClientScopeDefaultOptionalType,
  ClientScope,
} from "../../components/client-scope/ClientScopeTypes";
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { useLoginProviders } from "../../context/server-info/ServerInfoProvider";
import { convertAttributeNameToForm, convertToFormValues } from "../../util";
import { useRealm } from "../../context/realm-context/RealmContext";
import { getProtocolName } from "../../clients/utils";
import { toClientScopes } from "../routes/ClientScopes";
import { FormAccess } from "../../components/form-access/FormAccess";
import { KeycloakTextInput } from "../../components/keycloak-text-input/KeycloakTextInput";
import { KeycloakTextArea } from "../../components/keycloak-text-area/KeycloakTextArea";

type ScopeFormProps = {
  clientScope?: ClientScopeDefaultOptionalType;
  save: (clientScope: ClientScopeDefaultOptionalType) => void;
};

export const ScopeForm = ({ clientScope, save }: ScopeFormProps) => {
  const { t } = useTranslation("client-scopes");
  const { t: tc } = useTranslation("clients");
  const {
    register,
    control,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ClientScopeDefaultOptionalType>();
  const { realm } = useRealm();

  const providers = useLoginProviders();
  const [open, isOpen] = useState(false);
  const [openType, setOpenType] = useState(false);
  const { id } = useParams<{ id: string }>();

  const displayOnConsentScreen: "true" | "false" = useWatch({
    control,
    name: convertAttributeNameToForm("attributes.display.on.consent.screen"),
    defaultValue:
      clientScope?.attributes?.["display.on.consent.screen"] ??
      (id ? "false" : "true"),
  });

  useEffect(() => {
    // @ts-ignore
    convertToFormValues(clientScope, setValue);
  }, [clientScope]);

  return (
    <FormAccess
      isHorizontal
      onSubmit={handleSubmit(save)}
      role="manage-clients"
    >
      <FormGroup
        label={t("common:name")}
        labelIcon={
          <HelpItem helpText="client-scopes-help:name" fieldLabelId="name" />
        }
        fieldId="kc-name"
        isRequired
        validated={
          errors.name ? ValidatedOptions.error : ValidatedOptions.default
        }
        helperTextInvalid={t("common:required")}
      >
        <KeycloakTextInput
          type="text"
          id="kc-name"
          {...register("name", {
            required: true,
            validate: (value) =>
              !!value?.trim() || t("common:required").toString(),
          })}
          validated={
            errors.name ? ValidatedOptions.error : ValidatedOptions.default
          }
        />
      </FormGroup>
      <FormGroup
        label={t("common:description")}
        labelIcon={
          <HelpItem
            helpText="client-scopes-help:description"
            fieldLabelId="description"
          />
        }
        fieldId="kc-description"
        validated={
          errors.description ? ValidatedOptions.error : ValidatedOptions.default
        }
        helperTextInvalid={t("common:maxLength", { length: 255 })}
      >
        <KeycloakTextInput
          validated={
            errors.description
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
          type="text"
          id="kc-description"
          {...register("description", {
            maxLength: 255,
          })}
        />
      </FormGroup>
      <FormGroup
        label={t("type")}
        labelIcon={
          <HelpItem
            helpText="client-scopes-help:type"
            fieldLabelId="client-scopes:type"
          />
        }
        fieldId="type"
      >
        <Controller
          name="type"
          defaultValue={ClientScope.default}
          control={control}
          render={({ field }) => (
            <Select
              id="type"
              variant={SelectVariant.single}
              isOpen={openType}
              selections={field.value}
              onToggle={setOpenType}
              onSelect={(_, value) => {
                field.onChange(value);
                setOpenType(false);
              }}
            >
              {clientScopeTypesSelectOptions(t, allClientScopeTypes)}
            </Select>
          )}
        />
      </FormGroup>
      {!id && (
        <FormGroup
          label={t("protocol")}
          labelIcon={
            <HelpItem
              helpText="client-scopes-help:protocol"
              fieldLabelId="client-scopes:protocol"
            />
          }
          fieldId="kc-protocol"
        >
          <Controller
            name="protocol"
            defaultValue={providers[0]}
            control={control}
            render={({ field }) => (
              <Select
                toggleId="kc-protocol"
                required
                onToggle={isOpen}
                onSelect={(_, value) => {
                  field.onChange(value as string);
                  isOpen(false);
                }}
                selections={field.value}
                variant={SelectVariant.single}
                aria-label={t("selectEncryptionType")}
                isOpen={open}
              >
                {providers.map((option) => (
                  <SelectOption
                    selected={option === field.value}
                    key={option}
                    value={option}
                    data-testid={`option-${option}`}
                  >
                    {getProtocolName(tc, option)}
                  </SelectOption>
                ))}
              </Select>
            )}
          />
        </FormGroup>
      )}
      <FormGroup
        hasNoPaddingTop
        label={t("displayOnConsentScreen")}
        labelIcon={
          <HelpItem
            helpText="client-scopes-help:displayOnConsentScreen"
            fieldLabelId="client-scopes:displayOnConsentScreen"
          />
        }
        fieldId="kc-display.on.consent.screen"
      >
        <Controller
          name={convertAttributeNameToForm(
            "attributes.display.on.consent.screen"
          )}
          control={control}
          defaultValue={displayOnConsentScreen}
          render={({ field }) => (
            <Switch
              id="kc-display.on.consent.screen-switch"
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={field.value === "true"}
              onChange={(value) => field.onChange("" + value)}
              aria-label={t("displayOnConsentScreen")}
            />
          )}
        />
      </FormGroup>
      {displayOnConsentScreen === "true" && (
        <FormGroup
          label={t("consentScreenText")}
          labelIcon={
            <HelpItem
              helpText="client-scopes-help:consentScreenText"
              fieldLabelId="client-scopes:consentScreenText"
            />
          }
          fieldId="kc-consent-screen-text"
        >
          <KeycloakTextArea
            type="text"
            id="kc-consent-screen-text"
            {...register(
              convertAttributeNameToForm("attributes.consent.screen.text")
            )}
          />
        </FormGroup>
      )}
      <FormGroup
        hasNoPaddingTop
        label={t("includeInTokenScope")}
        labelIcon={
          <HelpItem
            helpText="client-scopes-help:includeInTokenScope"
            fieldLabelId="client-scopes:includeInTokenScope"
          />
        }
        fieldId="includeInTokenScope"
      >
        <Controller
          name={convertAttributeNameToForm("attributes.include.in.token.scope")}
          control={control}
          defaultValue="true"
          render={({ field }) => (
            <Switch
              id="includeInTokenScope-switch"
              label={t("common:on")}
              labelOff={t("common:off")}
              isChecked={field.value === "true"}
              onChange={(value) => field.onChange("" + value)}
              aria-label={t("includeInTokenScope")}
            />
          )}
        />
      </FormGroup>
      <FormGroup
        label={t("guiOrder")}
        labelIcon={
          <HelpItem
            helpText="client-scopes-help:guiOrder"
            fieldLabelId="client-scopes:guiOrder"
          />
        }
        fieldId="kc-gui-order"
      >
        <Controller
          name={convertAttributeNameToForm("attributes.gui.order")}
          defaultValue=""
          control={control}
          render={({ field }) => (
            <KeycloakTextInput
              id="kc-gui-order"
              type="number"
              value={field.value}
              data-testid="displayOrder"
              min={0}
              onChange={field.onChange}
            />
          )}
        />
      </FormGroup>
      <ActionGroup>
        <Button variant="primary" type="submit">
          {t("common:save")}
        </Button>
        <Button
          variant="link"
          component={(props) => (
            <Link {...props} to={toClientScopes({ realm })}></Link>
          )}
        >
          {t("common:cancel")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
