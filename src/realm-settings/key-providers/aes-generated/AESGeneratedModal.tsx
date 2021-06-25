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
import { AESGeneratedForm } from "./AESGeneratedForm";
import { useAlerts } from "../../../components/alert/Alerts";
import { useAdminClient } from "../../../context/auth/AdminClient";
import { useRealm } from "../../../context/realm-context/RealmContext";
import { useForm } from "react-hook-form";

type AESGeneratedModalProps = {
  providerType?: string;
  handleModalToggle?: () => void;
  refresh?: () => void;
  open: boolean;
};

export const AESGeneratedModal = ({
  providerType,
  handleModalToggle,
  open,
  refresh,
}: // save,
AESGeneratedModalProps) => {
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

  return (
    <Modal
      className="add-provider-modal"
      variant={ModalVariant.medium}
      title={t("realm-settings:addProvider")}
      isOpen={open}
      onClose={handleModalToggle}
    >
      <AESGeneratedForm
        save={save}
        providerType={providerType!}
        handleModalToggle={handleModalToggle}
      />
    </Modal>
  );
};
