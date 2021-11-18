import React, { useState } from "react";
import {
  AlertVariant,
  Button,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  Switch,
  ValidatedOptions,
} from "@patternfly/react-core";
import { cellWidth } from "@patternfly/react-table";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { useTranslation } from "react-i18next";
import { useAlerts } from "../components/alert/Alerts";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAdminClient } from "../context/auth/AdminClient";
import { emptyFormatter } from "../util";
import { Controller, useForm, useWatch } from "react-hook-form";
import { PasswordInput } from "../components/password-input/PasswordInput";
import { HelpItem } from "../components/help-enabler/HelpItem";
import "./user-section.css";

type UserCredentialsProps = {
  user: UserRepresentation;
};

type CredentialsForm = {
  password: string;
  passwordConfirmation: string;
  temporaryPassword: boolean;
};

const defaultValues: CredentialsForm = {
  password: "",
  passwordConfirmation: "",
  temporaryPassword: true,
};

export const UserCredentials = ({ user }: UserCredentialsProps) => {
  const { t } = useTranslation("users");
  const { addAlert, addError } = useAlerts();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());
  const [open, setOpen] = useState(false);
  const adminClient = useAdminClient();
  const form = useForm<CredentialsForm>({ defaultValues });
  const { control, errors, handleSubmit, register } = form;

  const passwordWatcher = useWatch({
    control,
    name: "password",
  });

  const passwordConfirmationWatcher = useWatch({
    control,
    name: "passwordConfirmation",
  });

  const isDisabled =
    passwordWatcher !== "" && passwordConfirmationWatcher !== "";

  const toggleModal = () => {
    setOpen(!open);
  };

  const saveUserPassword = async () => {
    const formValues = form.getValues();
    const passwordsMatch =
      formValues.password === formValues.passwordConfirmation;

    try {
      await adminClient.users.resetPassword({
        id: user.id!,
        credential: {
          temporary: formValues.temporaryPassword,
          type: "password",
          value: passwordsMatch ? formValues.password : "",
        },
      });
      refresh();
      addAlert(t("savePasswordSuccess"), AlertVariant.success);
      setOpen(false);
    } catch (error) {
      addError(
        !passwordsMatch
          ? t("users:savePasswordNotMatchError")
          : t("users:savePasswordError"),
        error
      );
    }
  };

  const loader = async () =>
    await adminClient.users.getCredentials({ id: user.id! });

  return (
    <>
      {open && (
        <Modal
          variant={ModalVariant.small}
          width={600}
          title={`${t("setPasswordFor")} ${user.username}`}
          isOpen
          onClose={() => setOpen(false)}
          actions={[
            <Button
              data-testid="ok-button"
              key="confirm"
              variant="primary"
              form="userCredentials-form"
              onClick={() => handleSubmit(saveUserPassword)()}
              isDisabled={!isDisabled}
            >
              {t("save")}
            </Button>,
            <Button
              data-testid="cancel-button"
              key="cancel"
              variant="link"
              form="userCredentials-form"
              onClick={() => {
                setOpen(false);
              }}
            >
              {t("cancel")}
            </Button>,
          ]}
        >
          <Form id="userCredentials-form" isHorizontal>
            <FormGroup
              name="password"
              label={t("common:password")}
              fieldId="password"
              helperTextInvalid={t("common:required")}
              validated={
                errors.password
                  ? ValidatedOptions.error
                  : ValidatedOptions.default
              }
              isRequired
            >
              <div className="kc-password">
                <PasswordInput
                  name="password"
                  aria-label="password"
                  ref={register({ required: true })}
                />
              </div>
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
              <div className="kc-passwordConfirmation">
                <PasswordInput
                  name="passwordConfirmation"
                  aria-label="passwordConfirm"
                  ref={register({ required: true })}
                />
              </div>
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
            >
              {" "}
              <Controller
                name="temporaryPassword"
                defaultValue={true}
                control={control}
                render={({ onChange, value }) => (
                  <Switch
                    className={"kc-temporaryPassword"}
                    onChange={(value) => onChange(value)}
                    isChecked={value}
                    label={t("common:on")}
                    labelOff={t("common:off")}
                  />
                )}
              ></Controller>
            </FormGroup>
          </Form>
        </Modal>
      )}
      <KeycloakDataTable
        key={key}
        loader={loader}
        ariaLabelKey="users:credentialsList"
        columns={[
          {
            name: "type",
            displayKey: "users:credentialType",
            cellFormatters: [emptyFormatter()],
            transforms: [cellWidth(40)],
          },
          {
            name: "user label",
            displayKey: "users:credentialUserLabel",
            transforms: [cellWidth(45)],
          },

          {
            name: "data",
            displayKey: "users:credentialData",
            cellFormatters: [emptyFormatter()],
            transforms: [cellWidth(20)],
          },
        ]}
        emptyState={
          <ListEmptyState
            hasIcon={true}
            message={t("noCredentials")}
            instructions={t("noCredentialsText")}
            primaryActionText={t("setPassword")}
            onPrimaryAction={toggleModal}
          />
        }
      />
    </>
  );
};
