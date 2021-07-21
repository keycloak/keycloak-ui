import React, { useState } from "react";
import {
  Button,
  ButtonVariant,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  TextContent,
  TextInput,
  ValidatedOptions,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import type UserRepresentation from "keycloak-admin/lib/defs/userRepresentation";
import { emailRegexPattern } from "../util";
import type RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import { useAdminClient, useFetch } from "../context/auth/AdminClient";
import moment from "moment";
// import "moment-timezone";
import { useRealm } from "../context/realm-context/RealmContext";

type RevocationModalProps = {
  id?: string;
  //   form: UseFormMethods<RealmRepresentation>;
  //   rename?: string;
  handleModalToggle: () => void;
  //   testConnection: () => void;
  //   realm: RealmRepresentation;
  // refresh: () => void;
  save: (realm?: UserRepresentation) => void;
};

export const RevocationModal = ({
  handleModalToggle,
  save,
}: // refresh,
//   realm,
RevocationModalProps) => {
  const { t } = useTranslation("sessions");
  const { realm: realmName } = useRealm();
  const adminClient = useAdminClient();
  const { register, errors, handleSubmit } = useForm();
  const [realm, setRealm] = useState<RealmRepresentation>();

  const [key, setKey] = useState(0);

  const refresh = () => {
    setKey(new Date().getTime());
  };

  useFetch(
    async () => {
      const realm = await adminClient.realms.findOne({ realm: realmName });

      return { realm };
    },
    ({ realm }) => {
      setRealm(realm);
    },
    [key]
  );

  const setToNow = async () => {
    await adminClient.realms.update(
      { realm: realmName },
      {
        realm: realmName,
        notBefore: Number(moment().unix()),
      }
    );
    adminClient.keycloak.logout({ redirectUri: "" });
  };

  const clearNotBefore = async () => {
    await adminClient.realms.update(
      { realm: realmName },
      {
        realm: realmName,
        notBefore: 0,
      }
    );
    refresh();
  };

  return (
    <Modal
      variant={ModalVariant.small}
      title={t("revocation")}
      isOpen={true}
      onClose={handleModalToggle}
      actions={[
        <Button
          data-testid="modal-test-connection-button"
          key="set-to-now"
          variant="tertiary"
          onClick={() => {
            setToNow();
            handleModalToggle();
          }}
          form="email-form"
        >
          {t("setToNow")}
        </Button>,
        <Button
          data-testid="modal-test-connection-button"
          key="clear"
          variant="tertiary"
          onClick={() => {
            clearNotBefore();
            handleModalToggle();
          }}
          form="email-form"
        >
          {t("clear")}
        </Button>,
        <Button
          data-testid="modal-test-connection-button"
          key="push"
          variant="secondary"
          type="submit"
          form="email-form"
        >
          {t("push")}
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
      <TextContent className="kc-provide-email-text">
        {t("revocationDescription")}
      </TextContent>
      <Form id="email-form" isHorizontal onSubmit={handleSubmit(save)}>
        <FormGroup
          className="kc-email-form-group"
          label={t("notBefore")}
          name="add-email-address"
          fieldId="email-id"
          helperTextInvalid={t("users:emailInvalid")}
          validated={
            errors.email ? ValidatedOptions.error : ValidatedOptions.default
          }
          //   isRequired
        >
          <TextInput
            data-testid="email-address-input"
            ref={register({ required: true, pattern: emailRegexPattern })}
            autoFocus
            isReadOnly
            value={
              realm?.notBefore === 0
                ? (t("None") as string)
                : new Date(realm?.notBefore! * 1000).toString()
            }
            type="text"
            id="add-email"
            name="notBefore"
            validated={
              errors.email ? ValidatedOptions.error : ValidatedOptions.default
            }
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};
