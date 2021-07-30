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
import { HelpItem } from "../../components/help-enabler/HelpItem";
import { SwitchField } from "../component/SwitchField";
import { TextField } from "../component/TextField";

import "./discovery-settings.css";

type DescriptorSettingsProps = {
  readOnly: boolean;
};

const Fields = ({ readOnly }: DescriptorSettingsProps) => {
  const { t } = useTranslation("identity-providers");
  const { t: th } = useTranslation("identity-providers-help");

  const { register, control, errors } = useFormContext();
  const [namedPolicyDropdownOpen, setNamedPolicyDropdownOpen] = useState(false);
  const [principalTypeDropdownOpen, setPrincipalTypeDropdownOpen] =
    useState(false);
  const [signatureAlgorithmDropdownOpen, setSignatureAlgorithmDropdownOpen] =
    useState(false);
  const [
    samlSignatureKeyNameDropdownOpen,
    setSamlSignatureKeyNameDropdownOpen,
  ] = useState(false);

  const wantAuthnSigned = useWatch({
    control: control,
    name: "config.wantAuthnRequestsSigned",
  });

  const validateSignature = useWatch({
    control: control,
    name: "config.validateSignature",
  });

  return (
    <div className="pf-c-form pf-m-horizontal">
      <FormGroup
        label={t("Single Sign-On service URL")}
        labelIcon={
          <HelpItem
            helpText={th("alias")}
            forLabel={t("alias")}
            forID="alias"
          />
        }
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
          name="config.singleSignOnServiceUrl"
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
          isReadOnly={readOnly}
        />
      </FormGroup>

      <SwitchField
        field="config.backchannelSupported"
        label="backchannelLogout"
        isReadOnly={readOnly}
      />

      <FormGroup
        label={t("nameIdPolicyFormat")}
        fieldId="nameIdPolicy"
        helperTextInvalid={t("common:required")}
      >
        <Select
          name="config.nameIDPolicyFormat"
          data-testid="nameid-policy-format-select"
          isOpen={namedPolicyDropdownOpen}
          variant={SelectVariant.single}
          onToggle={(isExpanded) => setNamedPolicyDropdownOpen(isExpanded)}
          onSelect={() => {
            setNamedPolicyDropdownOpen(false);
          }}
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
        helperTextInvalid={t("common:required")}
      >
        <Select
          name="config.principalType"
          data-testid="principal-type-select"
          isOpen={principalTypeDropdownOpen}
          variant={SelectVariant.single}
          onToggle={(isExpanded) => setPrincipalTypeDropdownOpen(isExpanded)}
          onSelect={() => {
            setPrincipalTypeDropdownOpen(false);
          }}
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
        field="config.postBindingResponse"
        label={t("httpPostBindingResponse")}
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.postBindingAuthnRequest"
        label={t("httpPostBindingAuthnRequest")}
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.postBindingLogout"
        label={t("httpPostBindingLogout")}
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.wantAuthnRequestsSigned"
        label={t("wantAuthnRequestsSigned")}
        isReadOnly={readOnly}
      />
      {wantAuthnSigned === "true" && (
        <>
          <FormGroup
            label={t("signatureAlgorithm")}
            fieldId="signatureAlgorithm"
          >
            <Select
              name="config.signatureAlgorithm"
              data-testid="signature-algorithm-select"
              isOpen={signatureAlgorithmDropdownOpen}
              variant={SelectVariant.single}
              onToggle={(isExpanded) =>
                setSignatureAlgorithmDropdownOpen(isExpanded)
              }
              onSelect={() => {
                setSignatureAlgorithmDropdownOpen(false);
              }}
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
          >
            <Select
              name="config.xmlSigKeyInfoKeyNameTransformer"
              data-testid="saml-signature-key-name-select"
              isOpen={samlSignatureKeyNameDropdownOpen}
              variant={SelectVariant.single}
              onToggle={(isExpanded) =>
                setSamlSignatureKeyNameDropdownOpen(isExpanded)
              }
              onSelect={() => {
                setSamlSignatureKeyNameDropdownOpen(false);
              }}
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
        field="config.wantAssertionsSigned"
        label={t("wantAssertionsSigned")}
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.wantAssertionsEncrypted"
        label={t("wantAssertionsEncrypted")}
        isReadOnly={readOnly}
      />
      <SwitchField
        field="config.forceAuthn"
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
            field="config.signingCertificate"
            label={t("validatingX509Certs")}
            isReadOnly={readOnly}
          />
        </>
      )}
      <SwitchField
        field="config.signSpMetadata"
        label={t("signServiceProviderMetadata")}
        isReadOnly={readOnly}
      />
      <SwitchField
        field="config.passSubject"
        label={t("passSubject")}
        isReadOnly={readOnly}
      />

      <FormGroup
        label={t("allowedClockSkew")}
        fieldId="allowedClockSkew"
        helperTextInvalid={t("common:required")}
      >
        <TextInput
          type="text"
          id="allowedClockSkew"
          name="config.allowedClockSkew"
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
