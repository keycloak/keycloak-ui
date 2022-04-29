import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Modal,
  ModalVariant,
  Popover,
  Text,
  TextContent,
  TextVariants,
} from "@patternfly/react-core";
import { CheckCircleIcon } from "@patternfly/react-icons";

import type { AuthenticationType } from "../AuthenticationSection";
import { KeycloakDataTable } from "../../components/table-toolbar/KeycloakDataTable";
import { toUpperCase } from "../../util";
import useToggle from "../../utils/useToggle";

type UsedByProps = {
  authType: AuthenticationType;
};

const Label = ({ id, label }: { id: string; label: string }) => (
  <>
    <CheckCircleIcon
      className="keycloak_authentication-section__usedby"
      key={`icon-${id}`}
    />{" "}
    {label}
  </>
);

type UsedByModalProps = {
  values: string[];
  onClose: () => void;
  clients: boolean;
};

const UsedByModal = ({ values, clients, onClose }: UsedByModalProps) => {
  const { t } = useTranslation("authentication");
  return (
    <Modal
      header={
        <TextContent>
          <Text component={TextVariants.h1}>{t("flowUsedBy")}</Text>
          <Text>
            {t("flowUsedByDescription", {
              value: clients ? t("clients") : t("identiyProviders"),
            })}
          </Text>
        </TextContent>
      }
      variant={ModalVariant.medium}
      isOpen
      onClose={onClose}
      actions={[
        <Button
          data-testid="cancel"
          id="modal-cancel"
          key="cancel"
          onClick={onClose}
        >
          {t("common:close")}
        </Button>,
      ]}
    >
      <KeycloakDataTable
        loader={values.map((value) => ({ name: value }))}
        ariaLabelKey="authentication:usedBy"
        searchPlaceholderKey="common:search"
        columns={[
          {
            name: "name",
          },
        ]}
      />
    </Modal>
  );
};

export const UsedBy = ({
  authType: {
    id,
    usedBy: { type, values },
  },
}: UsedByProps) => {
  const { t } = useTranslation("authentication");
  const [open, toggle] = useToggle();

  return (
    <>
      {open && (
        <UsedByModal
          values={values}
          onClose={toggle}
          clients={type === "specificClients"}
        />
      )}
      {(type === "specificProviders" || type === "specificClients") &&
        (values.length < 8 ? (
          <Popover
            key={id}
            aria-label={t("usedBy")}
            bodyContent={
              <div key={`usedBy-${id}-${values}`}>
                {t(
                  "appliedBy" +
                    (type === "specificClients" ? "Clients" : "Providers")
                )}{" "}
                {values.map((used, index) => (
                  <>
                    <strong>{used}</strong>
                    {index < values.length - 1 ? ", " : ""}
                  </>
                ))}
              </div>
            }
          >
            <a href="javascript:;">
              <Label id={id!} label={t(type!)} />
            </a>
          </Popover>
        ) : (
          <a href="javascript:;" onClick={toggle}>
            <Label id={id!} label={t(type!)} />
          </a>
        ))}
      {type === "default" && <Label id={id!} label={toUpperCase(values[0])} />}
      {!type && t("notInUse")}
    </>
  );
};
