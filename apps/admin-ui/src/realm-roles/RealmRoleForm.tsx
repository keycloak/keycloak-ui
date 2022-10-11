import {
  ActionGroup,
  Button,
  FormGroup,
  PageSection,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import type { UseFormReturn } from "react-hook-form";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { FormAccess } from "../components/form-access/FormAccess";
import type { AttributeForm } from "../components/key-value-form/AttributeForm";
import { KeycloakTextInput } from "../components/keycloak-text-input/KeycloakTextInput";
import { KeycloakTextArea } from "../components/keycloak-text-area/KeycloakTextArea";
import { useRealm } from "../context/realm-context/RealmContext";
import { useNavigate } from "react-router-dom-v5-compat";

export type RealmRoleFormProps = {
  form: UseFormReturn<AttributeForm>;
  save: () => void;
  editMode: boolean;
  reset: () => void;
};

export const RealmRoleForm = ({
  form: {
    handleSubmit,
    register,
    getValues,
    formState: { errors },
  },
  save,
  editMode,
  reset,
}: RealmRoleFormProps) => {
  const { t } = useTranslation("roles");
  const navigate = useNavigate();
  const { realm: realmName } = useRealm();

  return (
    <>
      {!editMode && <ViewHeader titleKey={t("createRole")} />}
      <PageSection variant="light">
        <FormAccess
          isHorizontal
          onSubmit={handleSubmit(save)}
          role="manage-realm"
          className="pf-u-mt-lg"
        >
          <FormGroup
            label={t("roleName")}
            fieldId="kc-name"
            isRequired
            validated={errors.name ? "error" : "default"}
            helperTextInvalid={t("common:required")}
          >
            <KeycloakTextInput
              type="text"
              id="kc-name"
              isReadOnly={editMode}
              {...register("name", {
                required: !editMode,
                validate: (value) =>
                  !value ||
                  value.trim().length === 0 ||
                  t("common:required").toString(),
              })}
            />
          </FormGroup>
          <FormGroup
            label={t("common:description")}
            fieldId="kc-description"
            validated={
              errors.description
                ? ValidatedOptions.error
                : ValidatedOptions.default
            }
            helperTextInvalid={errors.description?.message}
          >
            <KeycloakTextArea
              aria-label="description"
              isDisabled={getValues().name?.includes("default-roles")}
              type="text"
              validated={
                errors.description
                  ? ValidatedOptions.error
                  : ValidatedOptions.default
              }
              id="kc-role-description"
              {...register("description", {
                maxLength: {
                  value: 255,
                  message: t("common:maxLength", { length: 255 }),
                },
              })}
            />
          </FormGroup>
          <ActionGroup>
            <Button
              variant="primary"
              onClick={save}
              data-testid="realm-roles-save-button"
            >
              {t("common:save")}
            </Button>
            <Button
              data-testid="cancel"
              onClick={() =>
                editMode ? reset() : navigate(`/${realmName}/roles`)
              }
              variant="link"
            >
              {editMode ? t("common:revert") : t("common:cancel")}
            </Button>
          </ActionGroup>
        </FormAccess>
      </PageSection>
    </>
  );
};
