import React, { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Divider,
  Dropdown,
  DropdownItem,
  KebabToggle,
  ToolbarItem,
} from "@patternfly/react-core";
import { useAlerts } from "../../components/alert/Alerts";
import { KeycloakSpinner } from "../../components/keycloak-spinner/KeycloakSpinner";
import { DraggableTable } from "../../authentication/components/DraggableTable";
import type UserProfileConfig from "@keycloak/keycloak-admin-client/lib/defs/userProfileConfig";
import type { UserProfileAttribute } from "@keycloak/keycloak-admin-client/lib/defs/userProfileConfig";
import { useAdminClient } from "../../context/auth/AdminClient";
import { useHistory } from "react-router-dom";
import { toAddAttribute } from "../routes/AddAttribute";
import { useRealm } from "../../context/realm-context/RealmContext";
import { useUserProfile } from "./UserProfileContext";
import { useConfirmDialog } from "../../components/confirm-dialog/ConfirmDialog";

type DataType = UserProfileConfig & UserProfileAttribute;

type Row = {
  name: string;
  displayName: string;
  attributeGroup: string;
  data: DataType;
};

export const AttributesTab = () => {
  const { config } = useUserProfile();
  const { realm: realmName } = useRealm();
  const adminClient = useAdminClient();
  const { t } = useTranslation("realm-settings");
  const history = useHistory();
  const { addAlert, addError } = useAlerts();
  const [attributesList, setAttributesList] = useState<Row[]>();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(key + 1);
  const [attributeToDelete, setAttributeToDelete] =
    useState<{ name: string }>();
  const [kebabOpen, setKebabOpen] = useState({
    status: false,
    rowKey: "",
  });

  const executeMove = async (
    attribute: UserProfileAttribute,
    times: number
  ) => {
    try {
      //TODO backend call
      console.log(attribute, times);
      refresh();

      addAlert(t("updatedUserProfileSuccess"), AlertVariant.success);
    } catch (error) {
      addError(t("updatedUserProfileError"), error);
    }
  };

  if (!config) {
    return <KeycloakSpinner />;
  }

  const goToCreate = () => history.push(toAddAttribute({ realm: realmName }));

//   const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
//     titleKey: t("deleteAttributeConfirmTitle"),
//     messageKey: t("deleteAttributeConfirm", {
//       attributeName: attributeToDelete?.name!,
//     }),
//     continueButtonLabel: t("common:delete"),
//     continueButtonVariant: ButtonVariant.danger,
//     onConfirm: async () => {
//       try {
//         //TODO backend call
//         addAlert(t("deleteAttributeSuccess"), AlertVariant.success);
//         setKey((key) => key + 1);
//       } catch (error) {
//         addError(t("deleteAttributeError"), error);
//       }
//     },
//   });

  return (
    <>
      <ToolbarItem className="kc-toolbar-attributesTab">
        <Button
          data-testid="createAttributeBtn"
          variant="primary"
          onClick={goToCreate}
        >
          {t("createAttribute")}
        </Button>
      </ToolbarItem>
      <Divider />
      {/* <DeleteConfirm /> */}
      <DraggableTable
        keyField="name"
        onDragFinish={async (nameDragged, items) => {
          const keys = attributesList!.map((e) => e.name);
          const newIndex = items.indexOf(nameDragged);
          const oldIndex = keys.indexOf(nameDragged);
          const dragged = attributesList![oldIndex].data;
          if (!dragged.name) return;

          const times = newIndex - oldIndex;
          executeMove(dragged, times);
        }}
        columns={[
          {
            name: "name",
            displayKey: t("attributeName"),
          },
          {
            name: "displayName",
            displayKey: t("attributeDisplayName"),
          },
          {
            name: "group",
            displayKey: t("attributeGroup"),
          },
          {
            name: "",
            displayKey: "",
            cellRenderer: (row) => (
              <Dropdown
                id={`${row.name}`}
                label={t("attributesDropdown")}
                onSelect={() => console.log(row)}
                toggle={
                  <KebabToggle
                    onToggle={(status) =>
                      setKebabOpen({
                        status,
                        rowKey: row.name!,
                      })
                    }
                    id={`toggle-${row.name}`}
                  />
                }
                isOpen={kebabOpen.status && kebabOpen.rowKey === row.name}
                isPlain
                dropdownItems={[
                  <DropdownItem
                    key={`edit-dropdown-item-${row.name}`}
                    data-testid="editDropdownAttributeItem"
                    onClick={() => {
                      setKebabOpen({
                        status: false,
                        rowKey: row.name!,
                      });
                    }}
                  >
                    {t("common:edit")}
                  </DropdownItem>,
                  <Fragment key={`delete-dropdown-${row.name}`}>
                    {row.name !== "email" && row.name !== "username"
                      ? [
                          <DropdownItem
                            key={`delete-dropdown-item-${row.name}`}
                            data-testid="deleteDropdownAttributeItem"
                            onClick={() => {
                            //   toggleDeleteDialog();
                              setAttributeToDelete({
                                name: row.name!,
                              });
                              setKebabOpen({
                                status: false,
                                rowKey: row.name!,
                              });
                            }}
                          >
                            {t("common:delete")}
                          </DropdownItem>,
                        ]
                      : []}
                  </Fragment>,
                ]}
              />
            ),
          },
        ]}
        data={config.attributes!}
      />
    </>
  );
};
