import React from "react";
import { useTranslation } from "react-i18next";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";

export type PasswordPickerDialogProps = {
  text: { title: string; ok: string; cancel: string };
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
};

export const PasswordPickerDialog = ({
  text,
  onClose,
  onCancel,
  onConfirm,
}: PasswordPickerDialogProps) => {
  const { t } = useTranslation();

  return (
    <Modal
      variant={ModalVariant.small}
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
      {/* <FormAccess>

      </FormAccess> */}
    </Modal>
  );
};
