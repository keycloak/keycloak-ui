import React from "react";
import { useTranslation } from "react-i18next";
import { FormProvider, UseFormMethods } from "react-hook-form";
import { ActionGroup, Button } from "@patternfly/react-core";

import type { RoleRepresentation } from "../../model/role-model";
import type { KeyValueType } from "./attribute-convert";
import { AttributeInput } from "../attribute-input/AttributeInput";
import { FormAccess } from "../form-access/FormAccess";

export type AttributeForm = Omit<RoleRepresentation, "attributes"> & {
  attributes?: KeyValueType[];
};

export type AttributesFormProps = {
  form: UseFormMethods<AttributeForm>;
  save?: (model: AttributeForm) => void;
  reset?: () => void;
};

export const AttributesForm = ({ form, reset, save }: AttributesFormProps) => {
  const { t } = useTranslation("roles");
  const noSaveCancelButtons = !save && !reset;
  const {
    formState: { isDirty },
    handleSubmit,
  } = form;

  console.log("HI THESE ARE FORM VALUES", form.getValues());
  // form.setValue("name", "err");

  return (
    <FormAccess
      role="manage-realm"
      onSubmit={save ? handleSubmit(save) : undefined}
    >
      <FormProvider {...form}>
        <AttributeInput
          // selectableValues={["a", "v", "s"]}
          // isKeySelectable
          name="attributes"
        />
      </FormProvider>
      {!noSaveCancelButtons && (
        <ActionGroup className="kc-attributes__action-group">
          <Button
            data-testid="save-attributes"
            variant="primary"
            type="submit"
            isDisabled={!isDirty}
          >
            {t("common:save")}
          </Button>
          <Button onClick={reset} variant="link" isDisabled={!isDirty}>
            {t("common:revert")}
          </Button>
        </ActionGroup>
      )}
    </FormAccess>
  );
};
