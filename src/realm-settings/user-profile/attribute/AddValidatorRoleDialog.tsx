import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
import type { UserProfileAttribute } from "@keycloak/keycloak-admin-client/lib/defs/userProfileConfig";
import { FormProvider, useForm } from "react-hook-form";
import { DynamicComponents } from "../../../components/dynamic/DynamicComponents";
import type { Validator } from "./Validators";

export type AddValidatorRoleDialogProps = {
  open: boolean;
  toggleDialog: () => void;
  onConfirm: (newValidator: UserProfileAttribute[]) => void;
  selected: Validator;
};

export const AddValidatorRoleDialog = ({
  open,
  toggleDialog,
  onConfirm,
  selected,
}: AddValidatorRoleDialogProps) => {
  const { t } = useTranslation("realm-settings");
  const form = useForm();
  const { handleSubmit } = form;
  const selectedRoleValidator = selected;
  const [addedValidators, setAddedValidators] = useState<Validator[]>([]);

  const save = () => {
    const formValues = form.getValues();
    formValues.name = selectedRoleValidator.name;

    const newValidator = {
      name: formValues.name,
      config: formValues.config ?? [],
    };

    setAddedValidators([newValidator]);
    toggleDialog();
  };

  console.log(">>>> addedValidators: ", addedValidators);

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("addValidatorRole", {
        validatorName: selectedRoleValidator.name,
      })}
      description={selectedRoleValidator.description}
      isOpen={open}
      onClose={toggleDialog}
      width={"40%"}
      actions={[
        <Button
          key="save"
          data-testid="save-validator-role-button"
          variant="primary"
          onClick={() => handleSubmit(save)()}
        >
          {t("common:save")}
        </Button>,
        <Button key="cancel" variant="link" onClick={toggleDialog}>
          {t("common:cancel")}
        </Button>,
      ]}
    >
      <FormProvider {...form}>
        <DynamicComponents properties={selectedRoleValidator.config!} />
      </FormProvider>
    </Modal>
  );
};
