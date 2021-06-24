import React, { useState } from "react";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";


import type ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";

import { HMACGeneratedForm } from "./HMACGeneratedForm";
import { useAlerts } from "../../../components/alert/Alerts";
import { useAdminClient } from "../../../context/auth/AdminClient";
import { useRealm } from "../../../context/realm-context/RealmContext";

type HMACGeneratedModalProps = {
  providerType?: string;
  handleModalToggle?: () => void;
  refresh?: () => void;
  open: boolean;
};

export const HMACGeneratedModal = ({
  providerType,
  handleModalToggle,
  open,
  refresh,
}: // save,
HMACGeneratedModalProps) => {
  const { t } = useTranslation("groups");
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  const [displayName, setDisplayName] = useState("");
  const realm = useRealm();

  console.log("fasf", displayName)

  const save = async (component: ComponentRepresentation) => {
    try {
      await adminClient.components.create({
        parentId: realm.realm,
        name: displayName !== "" ? displayName : providerType,
        providerId: providerType,
        providerType: "org.keycloak.keys.KeyProvider",
        ...component,
      });
      refresh!();
      addAlert(t("realm-settings:saveProviderSuccess"), AlertVariant.success);
      handleModalToggle!();
    } catch (error) {
      addAlert(
        t("realm-settings:saveProviderError") +
          error.response?.data?.errorMessage || error,
        AlertVariant.danger
      );
    }
  };

  return (
    <Modal
      className="add-provider-modal"
      variant={ModalVariant.medium}
      title={t("realm-settings:addProvider")}
      isOpen={open}
      onClose={handleModalToggle}
      actions={[
        <Button
          data-testid="add-provider-button"
          key="confirm"
          variant="primary"
          type="submit"
          form="add-provider"
        >
          {t("common:Add")}
        </Button>,
        <Button
          id="modal-cancel"
          key="cancel"
          variant={ButtonVariant.link}
          onClick={() => {
            handleModalToggle!();
          }}
        >
          {t("common:cancel")}
        </Button>,
      ]}
    >
      <HMACGeneratedForm save={save} providerType={providerType} />
    </Modal>
  );
};
