import React, { useEffect, useState } from "react";
<<<<<<< HEAD
import { useParams } from "react-router-dom";
import { Button, Modal, ModalVariant } from "@patternfly/react-core";
=======
import { useHistory, useParams } from "react-router-dom";
import {
  Button,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";
>>>>>>> place modal in separate file
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
<<<<<<< HEAD
import { boolFormatter } from "../util";
=======
import { IFormatter, IFormatterValueType } from "@patternfly/react-table";
>>>>>>> place modal in separate file

export type AssociatedRolesModalProps = {
  open: boolean;
  toggleDialog: () => void;
};

<<<<<<< HEAD
=======

>>>>>>> place modal in separate file
const attributesToArray = (attributes: { [key: string]: string }): any => {
  if (!attributes || Object.keys(attributes).length == 0) {
    return [
      {
        key: "",
        value: "",
      },
    ];
  }
  return Object.keys(attributes).map((key) => ({
    key: key,
    value: attributes[key],
  }));
};

export const AssociatedRolesModal = (props: AssociatedRolesModalProps) => {
  const { t } = useTranslation("roles");
  const form = useForm<RoleRepresentation>({ mode: "onChange" });
  const [name, setName] = useState("");
  const adminClient = useAdminClient();
<<<<<<< HEAD
  const [selectedRows, setSelectedRows] = useState<RoleRepresentation[]>([]);

  const { id } = useParams<{ id: string }>();

  const loader = async () => {
    const allRoles = await adminClient.roles.find();
    const roles = allRoles.filter((x) => x.name != name);

    return roles;
  };
=======
  const [, setSelectedRows] = useState<RoleRepresentation[]>([]);

  const { id } = useParams<{ id: string }>();

  const loader = async () => await adminClient.roles.find();
>>>>>>> place modal in separate file

  useEffect(() => {
    (async () => {
      if (id) {
        const fetchedRole = await adminClient.roles.findOneById({ id });
        setName(fetchedRole.name!);
        setupForm(fetchedRole);
      } else {
        setName(t("createRole"));
      }
    })();
  }, []);

  const setupForm = (role: RoleRepresentation) => {
    Object.entries(role).map((entry) => {
      if (entry[0] === "attributes") {
        form.setValue(entry[0], attributesToArray(entry[1]));
      } else {
        form.setValue(entry[0], entry[1]);
      }
    });
  };

<<<<<<< HEAD
=======
  const boolFormatter = (): IFormatter => (data?: IFormatterValueType) => {
    const boolVal = data?.toString();

    return (boolVal
      ? boolVal.charAt(0).toUpperCase() + boolVal.slice(1)
      : undefined) as string;
  };

>>>>>>> place modal in separate file
  return (
    <Modal
      title={t("roles:associatedRolesModalTitle", { name })}
      isOpen={props.open}
      onClose={props.toggleDialog}
      variant={ModalVariant.large}
      actions={[
        <Button
<<<<<<< HEAD
          key="add"
          variant="primary"
          isDisabled={selectedRows.length === 0}
=======
          key="confirm"
          variant="primary"
>>>>>>> place modal in separate file
          onClick={() => {
            props.toggleDialog();
          }}
        >
<<<<<<< HEAD
          {t("common:add")}
=======
          Add
>>>>>>> place modal in separate file
        </Button>,
        <Button
          key="cancel"
          variant="link"
          onClick={() => {
            props.toggleDialog();
          }}
        >
<<<<<<< HEAD
          {t("common:cancel")}
=======
          Cancel
>>>>>>> place modal in separate file
        </Button>,
      ]}
    >
      <KeycloakDataTable
        key="role-list-modal"
        loader={loader}
        ariaLabelKey="roles:roleList"
        searchPlaceholderKey="roles:searchFor"
        canSelectAll
        // isPaginated
        onSelect={(rows) => {
          setSelectedRows([...rows]);
        }}
        columns={[
          {
            name: "name",
            displayKey: "roles:roleName",
          },
          {
            name: "composite",
            displayKey: "roles:composite",
            cellFormatters: [boolFormatter()],
          },
          {
            name: "description",
            displayKey: "roles:description",
          },
        ]}
        emptyState={
          <ListEmptyState
            hasIcon={true}
            message={t("noRolesInThisRealm")}
            instructions={t("noRolesInThisRealmInstructions")}
            primaryActionText={t("createRole")}
            // onPrimaryAction={goToCreate}
          />
        }
      />
    </Modal>
  );
};
