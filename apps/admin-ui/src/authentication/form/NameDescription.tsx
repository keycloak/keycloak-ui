import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { FormGroup, ValidatedOptions } from "@patternfly/react-core";

import { HelpItem } from "../../components/help-enabler/HelpItem";
import { KeycloakTextInput } from "../../components/keycloak-text-input/KeycloakTextInput";
import { KeycloakTextArea } from "../../components/keycloak-text-area/KeycloakTextArea";

export const NameDescription = () => {
  const { t } = useTranslation("authentication");
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <FormGroup
        label={t("common:name")}
        fieldId="kc-name"
        helperTextInvalid={t("common:required")}
        validated={
          errors.alias ? ValidatedOptions.error : ValidatedOptions.default
        }
        isRequired
        labelIcon={
          <HelpItem helpText="authentication-help:name" fieldLabelId="name" />
        }
      >
        <KeycloakTextInput
          type="text"
          id="kc-name"
          {...register("alias", { required: true })}
          data-testid="name"
          validated={
            errors.alias ? ValidatedOptions.error : ValidatedOptions.default
          }
        />
      </FormGroup>
      <FormGroup
        label={t("common:description")}
        fieldId="kc-description"
        labelIcon={
          <HelpItem
            helpText="authentication-help:description"
            fieldLabelId="description"
          />
        }
        validated={
          errors.description ? ValidatedOptions.error : ValidatedOptions.default
        }
        helperTextInvalid={errors.description?.message}
      >
        <KeycloakTextArea
          type="text"
          id="kc-description"
          {...register("description", {
            maxLength: {
              value: 255,
              message: t("common:maxLength", { length: 255 }),
            },
          })}
          data-testid="description"
          validated={
            errors.description
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
        />
      </FormGroup>
    </>
  );
};
