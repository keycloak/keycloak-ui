import React, { useState } from "react";
import {
  AlertVariant,
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
import { useRealm } from "../context/realm-context/RealmContext";
import type ClientRepresentation from "keycloak-admin/lib/defs/clientRepresentation";
import { useAlerts } from "../components/alert/Alerts";
import type GlobalRequestResult from "keycloak-admin/lib/defs/globalRequestResult";

type RevocationModalProps = {
  handleModalToggle: () => void;
  activeClients: ClientRepresentation[];
  save: (realm?: UserRepresentation) => void;
};

export const RevocationModal = ({
  handleModalToggle,
  save,
}: RevocationModalProps) => {
  const { t } = useTranslation("sessions");
  const { addAlert } = useAlerts();

  const { realm: realmName } = useRealm();
  const adminClient = useAdminClient();
  const { register, errors, handleSubmit } = useForm();
  const [realm, setRealm] = useState<RealmRepresentation>();

  const [key, setKey] = useState(0);

  const refresh = () => {
    setKey(new Date().getTime());
  };

  useFetch(
    () => adminClient.realms.findOne({ realm: realmName }),
    (realm) => {
      setRealm(realm);
    },
    [key]
  );

  const parseResult = (result: GlobalRequestResult, prefixKey: string) => {
    const successCount = result.successRequests?.length || 0;
    const failedCount = result.failedRequests?.length || 0;

    if (successCount === 0 && failedCount === 0) {
      addAlert(t("clients:noAdminUrlSet"), AlertVariant.warning);
    } else if (failedCount > 0) {
      addAlert(
        t("clients:" + prefixKey + "Success", {
          successNodes: result.successRequests,
        }),
        AlertVariant.success
      );
      addAlert(
        t("clients:" + prefixKey + "Fail", {
          failedNodes: result.failedRequests,
        }),
        AlertVariant.danger
      );
    } else {
      addAlert(
        t("clients:" + prefixKey + "Success", {
          successNodes: result.successRequests,
        }),
        AlertVariant.success
      );
    }
  };

  const setToNow = async () => {
    try {
      await adminClient.realms.update(
        { realm: realmName },
        {
          realm: realmName,
          notBefore: Date.now() / 1000,
        }
      );

      addAlert(t("notBeforeSuccess"), AlertVariant.success);
    } catch (error) {
      addAlert(t("setToNowError", { error }), AlertVariant.danger);
    }
  };

  const clearNotBefore = async () => {
    try {
      await adminClient.realms.update(
        { realm: realmName },
        {
          realm: realmName,
          notBefore: 0,
        }
      );
      addAlert(t("notBeforeClearedSuccess"), AlertVariant.success);
      refresh();
    } catch (error) {
      addAlert(t("notBeforeError", { error }), AlertVariant.danger);
    }
  };

  const push = async () => {
    console.log("push called");

    const result = adminClient.realms.pushRevocation({
      realm: realmName,
    }) as unknown as GlobalRequestResult;
    parseResult(result, "notBeforePush");

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
          data-testid="set-to-now-button"
          key="set-to-now"
          variant="tertiary"
          onClick={() => {
            setToNow();
            handleModalToggle();
          }}
          form="revocation-modal-form"
        >
          {t("setToNow")}
        </Button>,
        <Button
          data-testid="clear-not-before-button"
          key="clear"
          variant="tertiary"
          onClick={() => {
            clearNotBefore();
            handleModalToggle();
          }}
          form="revocation-modal-form"
        >
          {t("clear")}
        </Button>,
        <Button
          data-testid="modal-test-connection-button"
          key="push"
          variant="secondary"
          onClick={() => {
            push();
            handleModalToggle();
          }}
          form="revocation-modal-form"
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
      <TextContent className="kc-revocation-description-text">
        {t("revocationDescription")}
      </TextContent>
      <Form
        id="revocation-modal-form"
        isHorizontal
        onSubmit={handleSubmit(save)}
      >
        <FormGroup
          className="kc-revocation-modal-form-group"
          label={t("notBefore")}
          name="notBefore"
          fieldId="not-before"
          validated={
            errors.email ? ValidatedOptions.error : ValidatedOptions.default
          }
        >
          <TextInput
            data-testid="not-before-input"
            ref={register({ required: true, pattern: emailRegexPattern })}
            autoFocus
            isReadOnly
            value={
              realm?.notBefore === 0
                ? (t("none") as string)
                : new Date(realm?.notBefore! * 1000).toString()
            }
            type="text"
            id="not-before"
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
