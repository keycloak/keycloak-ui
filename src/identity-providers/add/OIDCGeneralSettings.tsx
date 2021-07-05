import React from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormGroup, TextInput, ValidatedOptions } from "@patternfly/react-core";

import { HelpItem } from "../../components/help-enabler/HelpItem";
import { RedirectUrl } from "../component/RedirectUrl";
import { TextField } from "../component/TextField";
import { DisplayOrder } from "../component/DisplayOrder";

export const OIDCGeneralSettings = ({ id }: { id: string }) => {
  const { t } = useTranslation("identity-providers");
  const { t: th } = useTranslation("identity-providers-help");

  const { register, errors } = useFormContext();

  return (
    <>
      <RedirectUrl id={id} />

      <FormGroup
        label={t("alias")}
        labelIcon={
          <HelpItem
            helpText={th("alias")}
            forLabel={t("alias")}
            forID="alias"
          />
        }
        fieldId="alias"
        isRequired
        validated={
          errors.alias ? ValidatedOptions.error : ValidatedOptions.default
        }
        helperTextInvalid={t("common:required")}
      >
        <TextInput
          isRequired
          type="text"
          id="alias"
          data-testid="alias"
          {...register("alias", { required: true })}
          validated={
            errors.alias ? ValidatedOptions.error : ValidatedOptions.default
          }
        />
      </FormGroup>

      <TextField field="displayName" label="displayName" />
      <DisplayOrder />
    </>
  );
};
