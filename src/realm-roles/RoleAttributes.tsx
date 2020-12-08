/* eslint-disable react/jsx-key */
/* eslint-disable react/display-name */
import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  ActionGroup,
  Button,
  ButtonVariant,
  TextInput,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import "./RealmRolesSection.css";
import { useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";

import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";
import { PlusCircleIcon } from "@patternfly/react-icons";

export const RoleAttributes = () => {
  const { t } = useTranslation("roles");
  const { setValue } = useForm<RoleRepresentation>();
  const history = useHistory();
  const [, setName] = useState("");

  const adminClient = useAdminClient();

  const { id } = useParams<{ id: string }>();

  const columns = ["Key", "Value"];
  const rows = [
    [
      <TextInput />,
      <TextInput />,
      <Button variant={ButtonVariant.link} tabIndex={-1}>
        <PlusCircleIcon className="co-icon-space-r" />
      </Button>,
    ],
    [
      <ActionGroup>
        <Button variant="primary" type="submit">
          {t("common:save")}
        </Button>
        <Button variant="link" onClick={() => history.push("/roles/")}>
          {t("common:reload")}
        </Button>
      </ActionGroup>,
    ],
  ];

  useEffect(() => {
    (async () => {
      const fetchedRole = await adminClient.roles.findOneById({ id });
      setName(fetchedRole.name!);
      setupForm(fetchedRole);
    })();
  }, []);

  const setupForm = (role: RoleRepresentation) => {
    Object.entries(role).map((entry) => {
      setValue(entry[0], entry[1]);
    });
  };

  return (
    <TableComposable className="keyValueTable" aria-label="Table text">
      <Thead>
        <Tr className="labels">
          <Th width={30}>{columns[0]}</Th>
          <Th>{columns[1]}</Th>
        </Tr>
      </Thead>
      <Tbody>
        {rows.map((row, rowIndex) => (
          <Tr key={rowIndex} className="tableRow">
            {row.map((cell, cellIndex) => (
              <Td
                key={`${rowIndex}_${cellIndex}`}
                id={`text-input-${rowIndex}-${cellIndex}`}
                dataLabel={columns[cellIndex]}
              >
                {cell}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </TableComposable>
  );
};
