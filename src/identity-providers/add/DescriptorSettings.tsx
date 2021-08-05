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
            helpText={th("ssoServiceUrl")}
            forLabel={t("Single Sign-On service URL")}
            forID="kc-sso-service-url"
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
            errors.config && errors.config.singleSignOnServiceUrl
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
          isReadOnly={readOnly}
        />
      </FormGroup>

      <FormGroup
        label={t("Single logout service URL")}
        labelIcon={
          <HelpItem
            helpText={th("singleLogoutServiceUrl")}
            forLabel={t("Single logout service URL")}
            forID="single-logout-service-url"
          />
        }
        fieldId="single-logout-service-url"
        validated={
          errors.config && errors.config.singleLogoutServiceUrl
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
        labelIcon={
          <HelpItem
            helpText={th("nameIdPolicyFormat")}
            forLabel={t("nameIdPolicyFormat")}
            forID="nameIdPolicyFormat"
          />
        }
        fieldId="nameIdPolicyFormat"
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
            data-testid="persistent-option"
            value={t("persistent")}
            isPlaceholder
          />
          <SelectOption
            key={1}
            data-testid="transient-option"
            value={t("transient")}
          />
          <SelectOption key={2} data-testid="email-option" value={t("email")} />
          <SelectOption
            key={3}
            data-testid="kerberos-option"
            value={t("kerberos")}
          />
          <SelectOption key={4} data-testid="x509-option" value={t("x509")} />
          <SelectOption
            key={5}
            data-testid="windowsDomainQN-option"
            value={t("windowsDomainQN")}
          />
          <SelectOption
            key={6}
            data-testid="unspecified-option"
            value={t("unspecified")}
          />
        </Select>
      </FormGroup>

      <FormGroup
        label={t("principalType")}
        labelIcon={
          <HelpItem
            helpText={th("principalType")}
            forLabel={t("principalType")}
            forID="principalType"
          />
        }
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
            data-testid="subjectNameId-option"
            value={t("subjectNameId")}
            isPlaceholder
          />
          <SelectOption
            key={1}
            data-testid="attributeName-option"
            value={t("attributeName")}
          />
          <SelectOption
            key={1}
            data-testid="attributeFriendlyName-option"
            value={t("attributeFriendlyName")}
          />
        </Select>
      </FormGroup>

      <SwitchField
        field="config.postBindingResponse"
        label="httpPostBindingResponse"
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.postBindingAuthnRequest"
        label="httpPostBindingAuthnRequest"
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.postBindingLogout"
        label="httpPostBindingLogout"
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.wantAuthnRequestsSigned"
        label="wantAuthnRequestsSigned"
        isReadOnly={readOnly}
      />

      {wantAuthnSigned === "true" && (
        <>
          <FormGroup
            label={t("signatureAlgorithm")}
            fieldId="signatureAlgorithm"
            labelIcon={
              <HelpItem
                helpText={th("singleLogoutServiceUrl")}
                forLabel={t("Single logout service URL")}
                forID="single-logout-service-url"
              />
            }
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
                data-testid="rsa-sha1-option"
                value="RSA_SHA1"
              />
              <SelectOption
                key={1}
                data-testid="rsa-sha256-option"
                value="RSA_SHA256"
                isPlaceholder
              />
              <SelectOption
                key={2}
                data-testid="rsa-sha256-mgf1-option"
                value="RSA_SHA256_MGF1"
              />
              <SelectOption
                key={3}
                data-testid="rsa-sha512-option"
                value="RSA_SHA512"
              />
              <SelectOption
                key={4}
                data-testid="rsa-sha512-mgf1-option"
                value="RSA_SHA512_MGF1"
              />
              <SelectOption
                key={5}
                data-testid="dsa-sha1-option"
                value="DSA_SHA1"
              />
            </Select>
          </FormGroup>
          <FormGroup
            label={t("samlSignatureKeyName")}
            labelIcon={
              <HelpItem
                helpText={th("singleLogoutServiceUrl")}
                forLabel={t("Single logout service URL")}
                forID="single-logout-service-url"
              />
            }
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
              <SelectOption key={0} data-testid="none-option" value="NONE" />
              <SelectOption
                key={0}
                data-testid="keyID-option"
                value={t("keyID")}
                isPlaceholder
              />
              <SelectOption
                key={1}
                data-testid="certSubject-option"
                value={t("certSubject")}
              />
            </Select>
          </FormGroup>
        </>
      )}

      <SwitchField
        field="config.wantAssertionsSigned"
        label="wantAssertionsSigned"
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.wantAssertionsEncrypted"
        label="wantAssertionsEncrypted"
        isReadOnly={readOnly}
      />
      <SwitchField
        field="config.forceAuthn"
        label="forceAuthentication"
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.validateSignature"
        label="validateSignature"
        isReadOnly={readOnly}
      />
      {validateSignature === "true" && (
        <>
          <TextField
            field="config.signingCertificate"
            label="validatingX509Certs"
            isReadOnly={readOnly}
          />
        </>
      )}
      <SwitchField
        field="config.signSpMetadata"
        label="signServiceProviderMetadata"
        isReadOnly={readOnly}
      />
      <SwitchField
        field="config.passSubject"
        label="passSubject"
        isReadOnly={readOnly}
      />

      <FormGroup
        label={t("allowedClockSkew")}
        labelIcon={
          <HelpItem
            helpText={th("allowedClockSkew")}
            forLabel={t("allowedClockSkew")}
            forID="allowedClockSkew"
          />
        }
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
