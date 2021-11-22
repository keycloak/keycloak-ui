import React, { FunctionComponent, useState } from "react";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Dropdown,
  DropdownItem,
  DropdownPosition,
  Form,
  FormGroup,
  KebabToggle,
  Modal,
  ModalVariant,
  Switch,
  Text,
  TextVariants,
  ValidatedOptions,
} from "@patternfly/react-core";
import {
  Table,
  TableBody,
  TableComposable,
  TableHeader,
  TableVariant,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import { useTranslation } from "react-i18next";
import { useAlerts } from "../components/alert/Alerts";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import { Controller, useForm, useWatch } from "react-hook-form";
import { PasswordInput } from "../components/password-input/PasswordInput";
import { HelpItem } from "../components/help-enabler/HelpItem";
import "./user-section.css";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { OutlinedQuestionCircleIcon } from "@patternfly/react-icons";
import type CredentialRepresentation from "@keycloak/keycloak-admin-client/lib/defs/credentialRepresentation";

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

type DisplayDialogProps = {
  titleKey: string;
  onClose: () => void;
};

const DisplayDialog: FunctionComponent<DisplayDialogProps> = ({
  titleKey,
  onClose,
  children,
}) => {
  const { t } = useTranslation("users");
  return (
    <Modal
      variant={ModalVariant.medium}
      title={t(titleKey)}
      isOpen={true}
      onClose={onClose}
    >
      {children}
    </Modal>
  );
};

export const UserCredentials = ({ user }: UserCredentialsProps) => {
  const { t } = useTranslation("users");
  const { addAlert, addError } = useAlerts();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());
  const [open, setOpen] = useState(false);
  const [openSaveConfirm, setOpenSaveConfirm] = useState(false);
  const [kebabOpen, setKebabOpen] = useState(false);
  const adminClient = useAdminClient();
  const form = useForm<CredentialsForm>({ defaultValues });
  const { control, errors, handleSubmit, register } = form;
  const [credentials, setCredentials] = useState<CredentialsForm>();
  const [userCredentials, setUserCredentials] = useState<
    CredentialRepresentation[]
  >([]);
  const [selectedCredential, setSelectedCredential] =
    useState<CredentialRepresentation>({});
  const [isResetPassword, setIsResetPassword] = useState(false);
  const [showData, setShowData] = useState(false);

  useFetch(
    () => adminClient.users.getCredentials({ id: user.id! }),
    (credentials) => {
      setUserCredentials(credentials);
    },
    [key]
  );

  const passwordWatcher = useWatch({
    control,
    name: "password",
  });

  const passwordConfirmationWatcher = useWatch({
    control,
    name: "passwordConfirmation",
  });

  const isNotDisabled =
    passwordWatcher !== "" && passwordConfirmationWatcher !== "";

  const toggleModal = () => {
    setOpen(!open);
  };

  const toggleConfirmSaveModal = () => {
    setOpenSaveConfirm(!openSaveConfirm);
  };

  const saveUserPassword = async () => {
    const passwordsMatch =
      credentials?.password === credentials?.passwordConfirmation;

    try {
      await adminClient.users.resetPassword({
        id: user.id!,
        credential: {
          temporary: credentials?.temporaryPassword,
          type: "password",
          value: passwordsMatch ? credentials?.password : "",
        },
      });
      refresh();
      addAlert(
        isResetPassword
          ? t("resetCredentialsSuccess")
          : t("savePasswordSuccess"),
        AlertVariant.success
      );
      setIsResetPassword(false);
      setOpenSaveConfirm(false);
    } catch (error) {
      addError(
        !passwordsMatch
          ? isResetPassword
            ? t("resetPasswordNotMatchError")
            : t("savePasswordNotMatchError")
          : isResetPassword
          ? t("resetPasswordError")
          : t("savePasswordError"),
        error
      );
    }
  };

  const resetPassword = () => {
    setIsResetPassword(true);
    setOpen(true);
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("deleteCredentialsConfirmTitle"),
    messageKey: t("deleteCredentialsConfirm"),
    continueButtonLabel: t("common:delete"),
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.users.deleteCredential({
          id: user.id!,
          credentialId: selectedCredential.id!,
        });
        addAlert(t("deleteCredentialsSuccess"), AlertVariant.success);
        setKey(key + 1);
      } catch (error) {
        addError(t("deleteCredentialsError"), error);
      }
    },
  });

  return (
    <>
      {open && (
        <Modal
          variant={ModalVariant.small}
          width={600}
          title={
            isResetPassword
              ? `${t("resetPasswordFor")} ${user.username}`
              : `${t("setPasswordFor")} ${user.username}`
          }
          isOpen
          onClose={() => {
            setIsResetPassword(false);
            setOpen(false);
          }}
          actions={[
            <Button
              data-testid="ok-button"
              key="confirm"
              variant="primary"
              form="userCredentials-form"
              onClick={() => {
                setOpen(false);
                setCredentials(form.getValues());
                toggleConfirmSaveModal();
              }}
              isDisabled={!isNotDisabled}
            >
              {t("save")}
            </Button>,
            <Button
              data-testid="cancel-button"
              key="cancel"
              variant="link"
              form="userCredentials-form"
              onClick={() => {
                setIsResetPassword(false);
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
              label={t("password")}
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
              label={
                isResetPassword
                  ? t("resetPasswordConfirmation")
                  : t("passwordConfirmation")
              }
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
      {openSaveConfirm && (
        <Modal
          variant={ModalVariant.small}
          width={600}
          title={
            isResetPassword
              ? t("resetPasswordConfirm")
              : t("setPasswordConfirm")
          }
          isOpen
          onClose={() => setOpenSaveConfirm(false)}
          actions={[
            <Button
              data-testid="setPassword-button"
              key="confirmSave"
              variant="danger"
              form="userCredentials-form"
              onClick={() => {
                handleSubmit(saveUserPassword)();
              }}
            >
              {isResetPassword ? t("resetPassword") : t("savePassword")}
            </Button>,
            <Button
              data-testid="cancelSetPassword-button"
              key="cancelConfirm"
              variant="link"
              form="userCredentials-form"
              onClick={() => {
                setOpenSaveConfirm(false);
              }}
            >
              {t("cancel")}
            </Button>,
          ]}
        >
          <Text component={TextVariants.h3}>
            {isResetPassword
              ? `${t("resetPasswordConfirmText")} ${user.username} ${t(
                  "questionMark"
                )}`
              : `${t("setPasswordConfirmText")} ${user.username} ${t(
                  "questionMark"
                )}`}
          </Text>
        </Modal>
      )}
      <DeleteConfirm />
      {showData && Object.keys(selectedCredential).length !== 0 && (
        <DisplayDialog
          titleKey="auth"
          onClose={() => {
            setShowData(false);
            setSelectedCredential({});
          }}
        >
          <Table
            aria-label="password-data"
            data-testid="password-data-dialog"
            variant={TableVariant.compact}
            cells={[t("showPasswordDataName"), t("showPasswordDataValue")]}
            // rows={rows}
          >
            <TableHeader />
            <TableBody />
          </Table>
        </DisplayDialog>
      )}
      {userCredentials.length !== 0 ? (
        <TableComposable aria-label="Simple table" variant={"compact"}>
          <Thead>
            <Tr>
              <Th>
                <OutlinedQuestionCircleIcon
                  key={`question-icon-`}
                  data-testid="question-icon"
                />
              </Th>
              <Th>Type</Th>
              <Th>User label</Th>
              <Th>Data</Th>
              <Th />
              <Th />
            </Tr>
          </Thead>
          <Tbody>
            <Tr key={"key"}>
              {userCredentials.map((credential) => (
                <>
                  <Td
                    draggableRow={{
                      id: `draggable-row-${credential.id}`,
                    }}
                  />
                  <Td key={`${credential}`} dataLabel={`columns-${credential}`}>
                    {credential.type}
                  </Td>
                  <Td>My Password</Td>
                  <Td>
                    <Button
                      className="kc-showData-btn"
                      variant="link"
                      onClick={() => {
                        setShowData(true);
                        setSelectedCredential(credential);
                      }}
                    >
                      Show data
                    </Button>
                  </Td>
                  <Td>
                    <Button variant="secondary" onClick={resetPassword}>
                      Reset password
                    </Button>
                  </Td>
                  <Td>
                    <Dropdown
                      isPlain
                      position={DropdownPosition.right}
                      toggle={
                        <KebabToggle onToggle={(open) => setKebabOpen(open)} />
                      }
                      isOpen={kebabOpen}
                      onSelect={() => setSelectedCredential(credential)}
                      dropdownItems={[
                        <DropdownItem
                          key="action"
                          component="button"
                          onClick={() => {
                            toggleDeleteDialog();
                            setKebabOpen(false);
                          }}
                        >
                          Delete
                        </DropdownItem>,
                      ]}
                    />
                  </Td>
                </>
              ))}
            </Tr>
          </Tbody>
        </TableComposable>
      ) : (
        <ListEmptyState
          hasIcon={true}
          message={t("noCredentials")}
          instructions={t("noCredentialsText")}
          primaryActionText={t("setPassword")}
          onPrimaryAction={toggleModal}
        />
      )}
    </>
  );
};
