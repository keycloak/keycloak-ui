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
        label={"Single Sign-On service URL"}
        fieldId="kc-authorization-url"
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
          data-testid="authorizationUrl"
          id="kc-authorization-url"
          name="config.authorizationUrl"
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
        label={"Single logout service URL"}
        fieldId="tokenUrl"
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
          id="tokenUrl"
          name="config.tokenUrl"
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
        label="Backchannel logout"
        isReadOnly={readOnly}
      />

      <FormGroup
        label={"NameID policy format"}
        fieldId="nameIdPolicy"
        isRequired
        helperTextInvalid={t("common:required")}
      >
        <Select
          data-testid="namedid-policy-format-select"
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
            value={"Persistent"}
            isPlaceholder
          />
          <SelectOption
            key={1}
            data-testid="regular-sso-option"
            value={"Another value"}
          />
        </Select>
      </FormGroup>

      <FormGroup
        label={"Principal type"}
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
            value={"Subject NameID"}
            isPlaceholder
          />
          <SelectOption
            key={1}
            data-testid="regular-sso-option"
            value={"Another value"}
          />
        </Select>
      </FormGroup>

      <SwitchField
        field="config.httpostbindingresponse"
        label="HTTP-POST binding response"
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.httppostbindingauthnrequest"
        label="HTTP-POST binding for AuthnRequest"
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.httppostbindinglogout"
        label="HTTP-POST binding logout"
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.wantauthnsigned"
        label="Want AuthnRequests signed"
        isReadOnly={readOnly}
      />
      {wantauthnsigned === "true" && (
        <>
          <FormGroup
            label={"Signature algorithm"}
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
                value={"RSA_SHA256"}
                isPlaceholder
              />

              <SelectOption
                key={1}
                data-testid="another-value-option"
                value={"Another value"}
              />
            </Select>
          </FormGroup>

          <FormGroup
            label={"SAML signature key name"}
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
                value={"Another value"}
              />
            </Select>
          </FormGroup>
        </>
      )}

      <SwitchField
        field="config.want-assertions-signed"
        label="Want Assertions signed"
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.want-assertions-encrypted"
        label="Want Assertions encrypted"
        isReadOnly={readOnly}
      />
      <SwitchField
        field="config.force-authentication"
        label="Force authentication"
        isReadOnly={readOnly}
      />

      <SwitchField
        field="config.validateSignature"
        label="Validate signature"
        isReadOnly={readOnly}
      />
      {validateSignature === "true" && (
        <>
          <TextField
            field="config.sig-algorithm"
            label="Validating X509 certificates"
            isReadOnly={readOnly}
          />
        </>
      )}
      <SwitchField
        field="config.sign-sp-metadata"
        label="Sign service provider metadata"
        isReadOnly={readOnly}
      />
      <SwitchField
        field="config.pass-subject"
        label="Pass subject"
        isReadOnly={readOnly}
      />

      <FormGroup
        label={"Allowed clock skew"}
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
