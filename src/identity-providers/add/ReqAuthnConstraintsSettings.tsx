import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Controller, useFormContext } from "react-hook-form";
import {
  FormGroup,
  Select,
  SelectOption,
  SelectVariant,
} from "@patternfly/react-core";

import { TextField } from "../component/TextField";
import { HelpItem } from "../../components/help-enabler/HelpItem";

const comparisonValues = ["exact", "minimum", "maximum", "better"];

// nameIDPolicyFormat": THESE ARE THE VALID RETURN VALUES, DISPLAY IS SIMPLER THOUGH:
// "urn:oasis:names:tc:SAML:2.0:nameid-format:persistent
// "urn:oasis:names:tc:SAML:2.0:nameid-format:transient
// "urn:oasis:names:tc:SAML:1.1:nameid-format:emailAddress
// "urn:oasis:names:tc:SAML:2.0:nameid-format:kerberos
// "urn:oasis:names:tc:SAML:1.1:nameid-format:X509SubjectName
// "urn:oasis:names:tc:SAML:1.1:nameid-format:WindowsDomainQualifiedName
// "urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified

export const ReqAuthnConstraints = () => {
  const { t } = useTranslation("identity-providers");
  const { control } = useFormContext();
  const [comparisonOpen, setComparisonOpen] = useState(false);
  return (
    <>
      <FormGroup
        label={t("comparison")}
        labelIcon={
          <HelpItem
            helpText="identity-providers-help:comparison"
            forLabel={t("comparison")}
            forID="comparison"
          />
        }
        fieldId="comparison"
      >
        <Controller
          name="config.authnContextComparisonType"
          defaultValue={comparisonValues[0]}
          control={control}
          render={({ onChange, value }) => (
            <Select
              toggleId="comparison"
              required
              direction="up"
              onToggle={() => setComparisonOpen(!comparisonOpen)}
              onSelect={(_, value) => {
                onChange(value.toString());
                setComparisonOpen(false);
              }}
              selections={value}
              variant={SelectVariant.single}
              aria-label={t("comparison")}
              isOpen={comparisonOpen}
            >
              {comparisonValues.map((option) => (
                <SelectOption
                  selected={option === value}
                  key={option}
                  value={option}
                >
                  {t(option)}
                </SelectOption>
              ))}
            </Select>
          )}
        />
      </FormGroup>
      <TextField
        field="config.authnContextClassRefs"
        label="authnContextClassRefs"
      />
      <TextField
        field="config.authnContextDeclRefs"
        label="authnContextDeclRefs"
      />
    </>
  );
};
