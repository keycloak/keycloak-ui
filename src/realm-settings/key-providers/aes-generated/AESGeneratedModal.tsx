import React from "react";
<<<<<<< HEAD
import { AlertVariant, Modal, ModalVariant } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";

import type ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";
import { AESGeneratedForm } from "./AESGeneratedForm";
import { useAlerts } from "../../../components/alert/Alerts";
import { useAdminClient } from "../../../context/auth/AdminClient";
import { useRealm } from "../../../context/realm-context/RealmContext";

type AESGeneratedModalProps = {
  providerType?: string;
  handleModalToggle?: () => void;
  refresh?: () => void;
=======
import { Modal, ModalVariant } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { AESGeneratedForm } from "./AESGeneratedForm";

type AESGeneratedModalProps = {
  providerType: string;
  handleModalToggle: () => void;
  refresh: () => void;
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
  open: boolean;
};

export const AESGeneratedModal = ({
  providerType,
  handleModalToggle,
  open,
  refresh,
}: AESGeneratedModalProps) => {
<<<<<<< HEAD
  const { t } = useTranslation("groups");
  const adminClient = useAdminClient();
  const { addAlert } = useAlerts();
  const realm = useRealm();

  const save = async (component: ComponentRepresentation) => {
    try {
      await adminClient.components.create({
        ...component,
        parentId: realm.realm,
        providerId: providerType,
        providerType: "org.keycloak.keys.KeyProvider",
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
=======
  const { t } = useTranslation("realm-settings");
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc

  return (
    <Modal
      className="add-provider-modal"
      variant={ModalVariant.medium}
<<<<<<< HEAD
      title={t("realm-settings:addProvider")}
=======
      title={t("addProvider")}
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
      isOpen={open}
      onClose={handleModalToggle}
    >
      <AESGeneratedForm
<<<<<<< HEAD
        save={save}
=======
>>>>>>> 9ad9d6c314de4a24800d73656eb778f229350dcc
        providerType={providerType!}
        handleModalToggle={handleModalToggle}
        refresh={refresh}
      />
    </Modal>
  );
};
