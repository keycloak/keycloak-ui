import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  Switch,
  ValidatedOptions,
} from "@patternfly/react-core";
import { PasswordInput } from "../password-input/PasswordInput";
import { Controller, useForm } from "react-hook-form";
import { HelpItem } from "../help-enabler/HelpItem";

export type PasswordPickerDialogProps = {
  text: { title: string; ok: string; cancel: string };
  onConfirm: () => void;
  //onConfirm: (credential: CredentialRepresentation) => void;
  onCancel: () => void;
  //onCancel: (credential: CredentialRepresentation) => void;
  onClose: () => void;
};

type SetPasswordForm = {
  password: string;
  passwordConfirmed: string;
  temporary: boolean;
};

const defaultValues: SetPasswordForm = {
  password: "",
  passwordConfirmed: "string",
  temporary: true,
};

export const PasswordPickerDialog = ({
  text,
  onClose,
  onCancel,
  onConfirm,
}: PasswordPickerDialogProps) => {
  const { t } = useTranslation();

  const form = useForm({ defaultValues });
  const { errors, handleSubmit } = form;

  const submitForm = () => {
    console.log(">>>> submitForm, PasswordPickerDialog");
  };

  return (
    <Modal
      variant={ModalVariant.small}
      width={600}
      title={t(text.title)}
      isOpen
      onClose={onClose}
      actions={[
        <Button
          data-testid={`${text.ok}-button`}
          key="confirm"
          variant="primary"
          form="userCredentials-form"
          onClick={() => {
            onConfirm();
          }}
        >
          {t(text.ok)}
        </Button>,
        <Button
          data-testid={`${text.cancel}-button`}
          key="cancel"
          variant="link"
          form="userCredentials-form"
          onClick={() => {
            onCancel();
          }}
        >
          {t(text.cancel)}
        </Button>,
      ]}
    >
      <Form
        id="userCredentials-form"
        isHorizontal
        onSubmit={handleSubmit(submitForm)}
      >
        <FormGroup
          name="password"
          label={t("common:password")}
          fieldId="password"
          helperTextInvalid={t("common:required")}
          validated={
            errors.password ? ValidatedOptions.error : ValidatedOptions.default
          }
          isRequired
        >
          <PasswordInput />
        </FormGroup>
        <FormGroup
          name="passwordConfirmation"
          label={t("common:passwordConfirmation")}
          fieldId="passwordConfirmation"
          helperTextInvalid={t("common:required")}
          validated={
            errors.passwordConfirmation
              ? ValidatedOptions.error
              : ValidatedOptions.default
          }
          isRequired
        >
          <PasswordInput />
        </FormGroup>
        <FormGroup
          label={t("common:temporaryPassword")}
          labelIcon={
            <HelpItem
              helpText={t("common:temporaryPasswordHelpText")}
              forLabel={t("common:temporaryPassword")}
              forID="kc-temporaryPasswordSwitch"
            />
          }
          fieldId="kc-temporaryPassword"
          hasNoPaddingTop
        >
          {" "}
          <Controller
            name="temporaryPassword"
            defaultValue={["true"]}
            control={form.control}
            render={({ onChange, value }) => (
              <Switch
                id={"kc-temporaryPassword"}
                isDisabled={false}
                onChange={(value) => onChange([`${value}`])}
                isChecked={value[0] === "true"}
                label={t("common:on")}
                labelOff={t("common:off")}
              />
            )}
          ></Controller>
        </FormGroup>
      </Form>
    </Modal>
  );
};
