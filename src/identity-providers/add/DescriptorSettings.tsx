import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormContext, useWatch } from "react-hook-form";
import {
  ExpandableSection,
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";

import { SwitchField } from "../component/SwitchField";
import { TextField } from "../component/TextField";

import "./discovery-settings.css";

type DescriptorSettingsProps = {
  readOnly: boolean;
};

const Fields = ({ readOnly }: DescriptorSettingsProps) => {
  const { t } = useTranslation("identity-providers");
  const { register, control, errors } = useFormContext();
  const [namedPolicyDropdownOpen, setNamedPolicyDropdownOpen] = useState(false);
  const [principalTypeDropdownOpen, setPrincipalTypeDropdownOpen] =
    useState(false);
  const [signatureAlgorithmDropdownOpen, setSignatureAlgorithimDropdownOpen] =
    useState(false);
  const [
    samlSignatureKeyNameDropdownOpen,
    setSamlSignatureKeyNameDropdownOpen,
  ] = useState(false);

  const wantauthnsigned = useWatch({
    control: control,
    name: "config.wantauthnsigned",
  });

  const validateSignature = useWatch({
    control: control,
    name: "config.validateSignature",
  });

  return (
    <div className="pf-c-form pf-m-horizontal">
      <FormGroup
        label={t("Single Sign-On service URL")}
        fieldId="kc-sso-service-url"
        isRequired
        validated={
          errors.config && errors.config.authorizationUrl
            ? ValidatedOptions.error
            : ValidatedOptions.default
        }
        helperTextInvalid={t("common:required")}
      >
        <TextInput
          type="text"
          data-testid="sso-service-url"
          id="kc-sso-service-url"
          name="config.ssoServiceUrl"
          ref={register({ required: true })}
          validated={
            errors.config && errors.config.authorizationUrl
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
          isReadOnly={readOnly}
        />
      </FormGroup>

      <FormGroup
        label={t("Single logout service URL")}
        fieldId="single-logout-service-url"
        isRequired
        validated={
          errors.config && errors.config.tokenUrl
            ? ValidatedOptions.error
            : ValidatedOptions.default
        }
        helperTextInvalid={t("common:required")}
      >
        <TextInput
          type="text"
          id="single-logout-service-url"
          name="config.singleLogoutServiceUrl"
          ref={register({ required: true })}
          validated={
            errors.config && errors.config.tokenUrl
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
          isReadOnly={readOnly}
        />
      </FormGroup>

      <SwitchField
        field="config.backchannel"
        label="backchannelLogout"
        isReadOnly={readOnly}
      />

      <FormGroup
        label={t("nameIdPolicyFormat")}
        fieldId="nameIdPolicy"
        isRequired
        helperTextInvalid={t("common:required")}
      >
        <Select
          data-testid="nameid-policy-format-select"
          isOpen={namedPolicyDropdownOpen}
          variant={SelectVariant.single}
          onToggle={(isExpanded) => setNamedPolicyDropdownOpen(isExpanded)}
          onSelect={() => {
            setNamedPolicyDropdownOpen(false);
          }}
          // selections={filterType}
        >
          <SelectOption
            key={0}
            data-testid="all-sessions-option"
            value={t("persistent")}
            isPlaceholder
          />
          <SelectOption
            key={1}
            data-testid="regular-sso-option"
            value={t("anotherValue")}
          />
        </Select>
      </FormGroup>

      <FormGroup
        label={t("principalType")}
        fieldId="principalType"
        isRequired
        helperTextInvalid={t("common:required")}
      >
        <Select
          data-testid="principal-type-select"
          isOpen={principalTypeDropdownOpen}
          variant={SelectVariant.single}
          onToggle={(isExpanded) => setPrincipalTypeDropdownOpen(isExpanded)}
          onSelect={() => {
            setPrincipalTypeDropdownOpen(false);
          }}
          // selections={filterType}
        >
          <SelectOption
            key={0}
            data-testid="all-sessions-option"
            value={t("subjectNameId")}
            isPlaceholder
          />
          <SelectOption
            key={1}
            data-testid="regular-sso-option"
            value={t("anotherValue")}
          />
        </Select>
      </FormGroup>

      <SwitchField
        field="config.httpostbindingresponse"
        label={t("httpPostBindingResponse")}
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.httppostbindingauthnrequest"
        label={t("httpPostBindingAuthnRequest")}
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.httppostbindinglogout"
        label={t("httpPostBindingLogout")}
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.wantauthnsigned"
        label={t("wantAuthnRequestsSigned")}
        isReadOnly={readOnly}
      />
      {wantauthnsigned === "true" && (
        <>
          <FormGroup
            label={t("signatureAlgorithm")}
            fieldId="signatureAlgorithm"
            isRequired
            helperTextInvalid={t("common:required")}
          >
            <Select
              data-testid="signature-algorithm-select"
              isOpen={signatureAlgorithmDropdownOpen}
              variant={SelectVariant.single}
              onToggle={(isExpanded) =>
                setSignatureAlgorithimDropdownOpen(isExpanded)
              }
              onSelect={() => {
                setSignatureAlgorithimDropdownOpen(false);
              }}
              // selections={filterType}
            >
              <SelectOption
                key={0}
                data-testid="rsa-sha256-option"
                value={t("RSA_SHA256")}
                isPlaceholder
              />

              <SelectOption
                key={1}
                data-testid="another-value-option"
                value={t("anotherValue")}
              />
            </Select>
          </FormGroup>

          <FormGroup
            label={t("samlSignatureKeyName")}
            fieldId="samlSignatureKeyName"
            isRequired
            helperTextInvalid={t("common:required")}
          >
            <Select
              data-testid="saml-signature-key-name-select"
              isOpen={samlSignatureKeyNameDropdownOpen}
              variant={SelectVariant.single}
              onToggle={(isExpanded) =>
                setSamlSignatureKeyNameDropdownOpen(isExpanded)
              }
              onSelect={() => {
                setSamlSignatureKeyNameDropdownOpen(false);
              }}
              // selections={filterType}
            >
              <SelectOption
                key={0}
                data-testid="keyID-option"
                value={"KEY_ID"}
                isPlaceholder
              />
              <SelectOption
                key={1}
                data-testid="another-value-option"
                value={t("anotherValue")}
              />
            </Select>
          </FormGroup>
        </>
      )}

      <SwitchField
        field="config.want-assertions-signed"
        label={t("wantAssertionsSigned")}
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.want-assertions-encrypted"
        label={t("wantAssertionsEncrypted")}
        isReadOnly={readOnly}
      />
      <SwitchField
        field="config.force-authentication"
        label={t("forceAuthentication")}
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.validateSignature"
        label={t("validateSignature")}
        isReadOnly={readOnly}
      />
      {validateSignature === "true" && (
        <>
          <TextField
            field="config.sig-algorithm"
            label={t("validatingX509Certs")}
            isReadOnly={readOnly}
          />
        </>
      )}
      <SwitchField
        field="config.sign-sp-metadata"
        label={t("signServiceProviderMetadata")}
        isReadOnly={readOnly}
      />
      <SwitchField
        field="config.pass-subject"
        label={t("passSubject")}
        isReadOnly={readOnly}
      />

      <FormGroup
        label={t("allowedClockSkew")}
        fieldId="allowedClockSkew"
        validated={
          errors.config && errors.config.tokenUrl
            ? ValidatedOptions.error
            : ValidatedOptions.default
        }
        helperTextInvalid={t("common:required")}
      >
        <TextInput
          type="text"
          id="tokenUrl"
          name="config.allowedClockSkew"
          ref={register({ required: true })}
          validated={
            errors.config && errors.config.tokenUrl
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
          isReadOnly={readOnly}
        />
      </FormGroup>
    </div>
  );
};

export const DescriptorSettings = ({ readOnly }: DescriptorSettingsProps) => {
  const { t } = useTranslation("identity-providers");
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <>
      {readOnly && (
        <ExpandableSection
          className="keycloak__discovery-settings__metadata"
          toggleText={isExpanded ? t("hideMetaData") : t("showMetaData")}
          onToggle={() => setIsExpanded(!isExpanded)}
          isExpanded={isExpanded}
        >
          <Fields readOnly={readOnly} />
        </ExpandableSection>
      )}
      {!readOnly && <Fields readOnly={readOnly} />}
    </>
  );
};
