import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  AlertVariant,
  ButtonVariant,
  Dropdown,
  DropdownGroup,
  DropdownItem,
  DropdownToggle,
  ModalVariant,
  PageSection,
  Pagination,
  Tab,
  Tabs,
  TabTitleText,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";

import { useAlerts } from "../components/alert/Alerts";
import { useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import { KeyValueType, RoleAttributes } from "./RoleAttributes";
import { ViewHeader } from "../components/view-header/ViewHeader";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { RealmRoleForm } from "./RealmRoleForm";
import { useRealm } from "../context/realm-context/RealmContext";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { CaretDownIcon, FilterIcon } from "@patternfly/react-icons";

const arrayToAttributes = (attributeArray: KeyValueType[]) => {
  const initValue: { [index: string]: string[] } = {};
  return attributeArray.reduce((acc, attribute) => {
    acc[attribute.key] = [attribute.value];
    return acc;
  }, initValue);
};

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

export const RealmRoleTabs = () => {
  const { t } = useTranslation("roles");
  const form = useForm<RoleRepresentation>({ mode: "onChange" });
  const history = useHistory();
  const [name, setName] = useState("");
  const adminClient = useAdminClient();
  const [activeTab, setActiveTab] = useState(0);
  const { realm } = useRealm();
  const [selectedRows, setSelectedRows] = useState<RoleRepresentation[]>([]);

  // const mapperList = clientScope.protocolMappers!;
  const rolesList = adminClient.roles.find();

  // const [filter, setFilter] = useState<ProtocolMapperRepresentation[]>([]);

  const { id } = useParams<{ id: string }>();

  const { addAlert } = useAlerts();

  // const loader = async () => await adminClient.roles.find();

  const toggleAddMapperDialog = async () => {
    setSelectedRows(await rolesList);
    setAddMapperDialogOpen(!addMapperDialogOpen);
  };

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

  const save = async (role: RoleRepresentation) => {
    try {
      if (id) {
        if (role.attributes) {
          // react-hook-form will use `KeyValueType[]` here we convert it back into an indexed property of string[]
          role.attributes = arrayToAttributes(
            (role.attributes as unknown) as KeyValueType[]
          );
        }
        await adminClient.roles.updateById({ id }, role);
      } else {
        await adminClient.roles.create(role);
        const createdRole = await adminClient.roles.findOneByName({
          name: role.name!,
        });
        history.push(`/${realm}/roles/${createdRole.id}`);
      }
      addAlert(t(id ? "roleSaveSuccess" : "roleCreated"), AlertVariant.success);
    } catch (error) {
      addAlert(
        t((id ? "roleSave" : "roleCreate") + "Error", {
          error: error.response.data?.errorMessage || error,
        }),
        AlertVariant.danger
      );
    }
  };

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: "roles:roleDeleteConfirm",
    messageKey: t("roles:roleDeleteConfirmDialog", { name }),
    continueButtonLabel: "common:delete",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.roles.delById({ id });
        addAlert(t("roleDeletedSuccess"), AlertVariant.success);
        history.replace(`/${realm}/roles`);
      } catch (error) {
        addAlert(`${t("roleDeleteError")} ${error}`, AlertVariant.danger);
      }
    },
  });

  console.log("selected rows", selectedRows);

  // const [isDropdownOpen, setDropdownOpen] = useState(false);

  // const dropdownItems = [
  //   <DropdownGroup key="group 1">
  //     <DropdownItem key="group 1 plaintext" component="div" isPlainText>Text</DropdownItem>
  //     <DropdownItem key="group 1 plaintext2" component="div" isPlainText>More text</DropdownItem>
  //   </DropdownGroup>,
  // ];

  // const onDropdownToggle = () => {
  //   setDropdownOpen(!isDropdownOpen);
  // };

  return (
    <>
      <DeleteConfirm />
      {/* <AssociatedRolesModal /> */}
      <ViewHeader
        titleKey={name}
        subKey={id ? "" : "roles:roleCreateExplain"}
        dropdownItems={
          id
            ? [
                <DropdownItem
                  key="action"
                  component="button"
                  onClick={() => toggleDeleteDialog()}
                >
                  {t("deleteRole")}
                </DropdownItem>,
                <DropdownItem
                  key="action"
                  component="button"
                  onClick={() => toggleAddMapperDialog(true)}
                >
                  {t("addAssociatedRolesText")}
                </DropdownItem>,
              ]
            : undefined
        }
      />
      <PageSection variant="light">
        {id && (
          <Tabs
            activeKey={activeTab}
            onSelect={(_, key) => setActiveTab(key as number)}
            isBox
          >
            <Tab
              eventKey={0}
              title={<TabTitleText>{t("details")}</TabTitleText>}
            >
              <RealmRoleForm form={form} save={save} editMode={true} />
            </Tab>
            <Tab
              eventKey={1}
              title={<TabTitleText>{t("attributes")}</TabTitleText>}
            >
              <RoleAttributes form={form} save={save} />
            </Tab>
          </Tabs>
        )}
        {!id && <RealmRoleForm form={form} save={save} editMode={false} />}
      </PageSection>
    </>
  );
};
