import React from "react";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import type GroupRepresentation from "@keycloak/keycloak-admin-client/lib/defs/groupRepresentation";
import { useAdminClient } from "../context/auth/AdminClient";
import { useAlerts } from "../components/alert/Alerts";
import _ from "lodash";
import { useParams } from "react-router-dom";
import type FederatedIdentityRepresentation from "@keycloak/keycloak-admin-client/lib/defs/federatedIdentityRepresentation";

type UserIdpModalProps = {
  federatedId?: string;
  rename?: string;
  handleModalToggle: () => void;
  refresh: (group?: GroupRepresentation) => void;
};

export const UserIdpModal = ({
  federatedId,
  rename,
  handleModalToggle,
  refresh,
}: UserIdpModalProps) => {
  const { t } = useTranslation("users");
  const adminClient = useAdminClient();
  const { addAlert, addError } = useAlerts();
  const { register, errors, handleSubmit, formState } = useForm({
    defaultValues: { name: rename },
    mode: "onChange",
  });

  const { id } = useParams<{ id: string }>();

  const submitForm = async (fedIdentity: FederatedIdentityRepresentation) => {
    try {
      await adminClient.users.addToFederatedIdentity({
        id: id!,
        federatedIdentityId: federatedId!,
        federatedIdentity: fedIdentity,
      });
      addAlert(t("users:idpLinkSuccess"), AlertVariant.success);
      handleModalToggle();
      refresh();
    } catch (error) {
      addError("users:couldNotLinkIdP", error);
    }
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("users:linkAccountTitle", {
        provider: _.capitalize(federatedId),
      })}
      isOpen={true}
      onClose={handleModalToggle}
      actions={[
        <Button
          data-testid={t("link")}
          key="confirm"
          variant="primary"
          type="submit"
          form="group-form"
          isDisabled={!formState.isValid}
        >
          {t("link")}
        </Button>,
        <Button
          id="modal-cancel"
          key="cancel"
          variant={ButtonVariant.link}
          onClick={() => {
            handleModalToggle();
          }}
        >
          {t("common:cancel")}
        </Button>,
      ]}
    >
      <Form id="group-form" isHorizontal onSubmit={handleSubmit(submitForm)}>
        <FormGroup
          name="idp-name-group"
          label={t("users:identityProvider")}
          fieldId="idp-name"
          helperTextInvalid={t("common:required")}
          validated={
            errors.name ? ValidatedOptions.error : ValidatedOptions.default
          }
        >
          <TextInput
            data-testid="idpNameInput"
            aria-label="Identity provider name input"
            ref={register({})}
            autoFocus
            isReadOnly
            type="text"
            id="link-idp-name"
            name="identityProvider"
            value={_.capitalize(federatedId)}
            validated={
              errors.name ? ValidatedOptions.error : ValidatedOptions.default
            }
          />
        </FormGroup>
        <FormGroup
          name="user-id-group"
          label={t("users:userID")}
          fieldId="user-id"
          helperTextInvalid={t("common:required")}
          validated={
            errors.name ? ValidatedOptions.error : ValidatedOptions.default
          }
        >
          <TextInput
            data-testid="userIdInput"
            aria-label="user ID input"
            ref={register({ required: true })}
            autoFocus
            type="text"
            id="link-idp-user-id"
            name="userId"
            validated={
              errors.name ? ValidatedOptions.error : ValidatedOptions.default
            }
          />
        </FormGroup>
        <FormGroup
          name="username-group"
          label={t("users:username")}
          fieldId="username"
          helperTextInvalid={t("common:required")}
          validated={
            errors.name ? ValidatedOptions.error : ValidatedOptions.default
          }
        >
          <TextInput
            data-testid="usernameInput"
            aria-label="username input"
            ref={register({ required: true })}
            autoFocus
            type="text"
            id="link-idp-username"
            name="userName"
            validated={
              errors.name ? ValidatedOptions.error : ValidatedOptions.default
            }
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};
