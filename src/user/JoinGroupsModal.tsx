import React, { createContext, useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Modal,
  ModalVariant,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { useForm } from "react-hook-form";
import { useAdminClient } from "../context/auth/AdminClient";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { CaretDownIcon, FilterIcon } from "@patternfly/react-icons";
import { AliasRendererComponent } from "./AliasRendererComponent";
import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";

export type JoinGroupsModalProps = {
  open: boolean;
  toggleDialog: () => void;
  onConfirm: (newReps: RoleRepresentation[]) => void;
  existingCompositeRoles: RoleRepresentation[];
};

const attributesToArray = (attributes: { [key: string]: string }): any => {
  if (!attributes || Object.keys(attributes).length === 0) {
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

type SubGroupsProps = {
  subGroups: GroupRepresentation[];
  setSubGroups: (group: GroupRepresentation[]) => void;
  clear: () => void;
  remove: (group: GroupRepresentation) => void;
};

const SubGroupContext = createContext<SubGroupsProps>({
  subGroups: [],
  setSubGroups: () => {},
  clear: () => {},
  remove: () => {},
});

export const SubGroups = ({ children }: { children: React.ReactNode }) => {
  const [subGroups, setSubGroups] = useState<GroupRepresentation[]>([]);

  const clear = () => setSubGroups([]);
  const remove = (group: GroupRepresentation) =>
    setSubGroups(
      subGroups.slice(
        0,
        subGroups.findIndex((g) => g.id === group.id)
      )
    );
  return (
    <SubGroupContext.Provider
      value={{ subGroups, setSubGroups, clear, remove }}
    >
      {children}
    </SubGroupContext.Provider>
  );
};

export const useSubGroups = () => useContext(SubGroupContext);

export const JoinGroupsModal = (props: JoinGroupsModalProps) => {
  const { t } = useTranslation("roles");
  const form = useForm<RoleRepresentation>({ mode: "onChange" });
  const [name, setName] = useState("");
  const adminClient = useAdminClient();
  const [selectedRows, setSelectedRows] = useState<RoleRepresentation[]>([]);

  const [isFilterDropdownOpen, setIsFilterDropdownOpen] = useState(false);
  const [filterType, setFilterType] = useState("roles");
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());

  const { id } = useParams<{ id: string }>();

  const alphabetize = (rolesList: RoleRepresentation[]) => {
    return rolesList.sort((r1, r2) => {
      const r1Name = r1.name?.toUpperCase();
      const r2Name = r2.name?.toUpperCase();
      if (r1Name! < r2Name!) {
        return -1;
      }
      if (r1Name! > r2Name!) {
        return 1;
      }

      return 0;
    });
  };

  const getId = (pathname: string) => {
    const pathParts = pathname.substr(1).split("/");
    return pathParts.length > 1 ? pathParts.splice(2) : undefined;
  };

  const loader = async () => {
    let groupsData;
    if (!id) {
      groupsData = await adminClient.groups.find();
    } else {
      const ids = getId(location.pathname);
      const isNavigationStateInValid = ids && ids.length !== subGroups.length;
      if (isNavigationStateInValid) {
        const groups = [];
        for (const i of ids!) {
          const group = await adminClient.groups.findOne({ id: i });
          if (group) groups.push(group);
        }
        setSubGroups(groups);
        groupsData = groups.pop()?.subGroups!;
      } else {
        const group = await adminClient.groups.findOne({ id });
        if (group) {
          setSubGroups([...subGroups, group]);
          groupsData = group.subGroups!;
        }
      }
    }

    if (groupsData) {
      const memberPromises = groupsData.map((group) => getMembers(group.id!));
      const memberData = await Promise.all(memberPromises);
      return groupsData.map((group: GroupTableData, i) => {
        group.membersLength = memberData[i];
        return group;
      });
    } else {
      history.push(`/${realm}/groups`);
    }

    return [];
  };

  const AliasRenderer = (role: RoleRepresentation) => {
    return (
      <>
        <AliasRendererComponent
          id={id}
          name={role.name}
          adminClient={adminClient}
          filterType={filterType}
          containerId={role.containerId}
        />
      </>
    );
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

  const setupForm = (role: RoleRepresentation) =>
    Object.entries(role).map((entry) => {
      if (entry[0] === "attributes") {
        form.setValue(entry[0], attributesToArray(entry[1]));
      } else {
        form.setValue(entry[0], entry[1]);
      }
    });

  const onFilterDropdownToggle = () => {
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  const onFilterDropdownSelect = (filterType: string) => {
    if (filterType === "roles") {
      setFilterType("clients");
    }
    if (filterType === "clients") {
      setFilterType("roles");
    }
    setIsFilterDropdownOpen(!isFilterDropdownOpen);
  };

  return (
    <Modal
      title={t("roles:associatedRolesModalTitle", { name })}
      isOpen={props.open}
      onClose={props.toggleDialog}
      variant={ModalVariant.large}
      actions={[
        <Button
          key="add"
          data-testid="add-associated-roles-button"
          variant="primary"
          isDisabled={!selectedRows?.length}
          onClick={() => {
            props.toggleDialog();
            props.onConfirm(selectedRows);
          }}
        >
          {t("common:add")}
        </Button>,
        <Button
          key="cancel"
          variant="link"
          onClick={() => {
            props.toggleDialog();
          }}
        >
          {t("common:cancel")}
        </Button>,
      ]}
    >
      <KeycloakDataTable
        key={key}
        loader={filterType === "roles" ? loader : clientRolesLoader}
        ariaLabelKey="roles:roleList"
        searchPlaceholderKey="roles:searchFor"
        searchTypeComponent={
          <Dropdown
            onSelect={() => onFilterDropdownSelect(filterType)}
            data-testid="filter-type-dropdown"
            toggle={
              <DropdownToggle
                id="toggle-id-9"
                onToggle={onFilterDropdownToggle}
                toggleIndicator={CaretDownIcon}
                icon={<FilterIcon />}
              >
                Filter by {filterType}
              </DropdownToggle>
            }
            isOpen={isFilterDropdownOpen}
            dropdownItems={[
              <DropdownItem
                data-testid="filter-type-dropdown-item"
                key="filter-type"
              >
                {filterType === "roles"
                  ? t("filterByClients")
                  : t("filterByRoles")}{" "}
              </DropdownItem>,
            ]}
          />
        }
        canSelectAll
        isPaginated
        onSelect={(rows) => {
          setSelectedRows([...rows]);
        }}
        columns={[
          {
            name: "name",
            displayKey: "roles:roleName",
            cellRenderer: AliasRenderer,
          },
          {
            name: "description",
            displayKey: "common:description",
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
