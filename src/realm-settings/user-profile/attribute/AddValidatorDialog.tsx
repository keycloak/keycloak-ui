import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Modal, ModalVariant } from "@patternfly/react-core";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { AddValidatorRoleDialog } from "./AddValidatorRoleDialog";
import { Validator, validators as allValidator } from "./Validators";
import useToggle from "../../../utils/useToggle";

export type AddValidatorDialogProps = {
  toggleDialog: () => void;
  onConfirm: (newValidator: Validator) => void;
};

export const AddValidatorDialog = ({
  toggleDialog,
  onConfirm,
}: AddValidatorDialogProps) => {
  const { t } = useTranslation("realm-settings");
  const [selectedValidator, setSelectedValidator] = useState<Validator>();
  const [validators, setValidators] = useState(allValidator);
  const [addValidatorRoleModalOpen, toggleModal] = useToggle();

  return (
    <>
      {addValidatorRoleModalOpen && (
        <AddValidatorRoleDialog
          onConfirm={(newValidator) => {
            onConfirm(newValidator);
            setValidators(
              validators.filter((v) => v.name !== newValidator.name)
            );
          }}
          open={addValidatorRoleModalOpen}
          toggleDialog={toggleModal}
          selected={selectedValidator!}
        />
      )}
      <Modal
        variant={ModalVariant.small}
        title={t("addValidator")}
        isOpen
        onClose={toggleDialog}
      >
        <TableComposable aria-label="validators-table">
          <Thead>
            <Tr>
              <Th>{t("validatorDialogColNames.colName")}</Th>
              <Th>{t("validatorDialogColNames.colDescription")}</Th>
            </Tr>
          </Thead>
          <Tbody>
            {validators.map((validator) => (
              <Tr
                key={validator.name}
                onRowClick={() => {
                  setSelectedValidator(validator);
                  toggleModal();
                }}
                isHoverable
              >
                <Td dataLabel={t("validatorDialogColNames.colName")}>
                  {validator.name}
                </Td>
                <Td dataLabel={t("validatorDialogColNames.colDescription")}>
                  {validator.description}
                </Td>
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      </Modal>
    </>
  );
};
