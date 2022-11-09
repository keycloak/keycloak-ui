import { ReactNode, useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, ButtonProps, Modal, ModalProps } from "@patternfly/react-core";

type ContinueCancelModalProps = Omit<ModalProps, "ref" | "children"> & {
  modalTitle: string;
  modalMessage?: string;
  buttonTitle: string | ReactNode;
  buttonVariant?: ButtonProps["variant"];
  isDisabled?: boolean;
  onContinue: () => void;
  continueLabel?: string;
  cancelLabel?: string;
  component?: React.ElementType<any> | React.ComponentType<any>;
  children?: ReactNode;
};

export const ContinueCancelModal = ({
  modalTitle,
  modalMessage,
  buttonTitle,
  isDisabled,
  buttonVariant,
  onContinue,
  continueLabel = "continue",
  cancelLabel = "doCancel",
  component = "button",
  children,
  ...rest
}: ContinueCancelModalProps) => {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const Component = component;

  return (
    <>
      <Component
        variant={buttonVariant}
        onClick={() => setOpen(true)}
        isDisabled={isDisabled}
      >
        {typeof buttonTitle === "string" ? t(buttonTitle) : buttonTitle}
      </Component>
      <Modal
        variant="small"
        {...rest}
        title={t(modalTitle)}
        isOpen={open}
        onClose={() => setOpen(false)}
        actions={[
          <Button
            id="modal-confirm"
            key="confirm"
            variant="primary"
            onClick={() => {
              setOpen(false);
              onContinue();
            }}
          >
            {t(continueLabel)}
          </Button>,
          <Button
            id="modal-cancel"
            key="cancel"
            variant="secondary"
            onClick={() => setOpen(false)}
          >
            {t(cancelLabel)}
          </Button>,
        ]}
      >
        {modalMessage ? t(modalMessage) : children}
      </Modal>
    </>
  );
};
