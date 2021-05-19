import React from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalVariant } from "@patternfly/react-core";
import { EventsTypeTable } from "./EventsTypeTable";
import { useServerInfo } from "../../context/server-info/ServerInfoProvider";

type AddEventTypesDialogProps = {
  configured: string[];
  onClose: () => void;
};

export const AddEventTypesDialog = ({
  onClose,
  configured,
}: AddEventTypesDialogProps) => {
  const { t } = useTranslation("realm-settings");
  const { enums } = useServerInfo();
  return (
    <Modal
      variant={ModalVariant.medium}
      title={t("addTypes")}
      isOpen={true}
      onClose={onClose}
    >
      <EventsTypeTable
        loader={() =>
          Promise.resolve(
            enums!["eventType"]
              .filter((type) => !configured.includes(type))
              .map((eventType) => {
                return { eventType };
              })
          )
        }
      />
    </Modal>
  );
};
