import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  PageSection,
} from "@patternfly/react-core";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAlerts } from "../components/alert/Alerts";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { emptyFormatter } from "../util";
import { asyncStateFetch, useAdminClient } from "../context/auth/AdminClient";
import GroupRepresentation from "keycloak-admin/lib/defs/groupRepresentation";
import { cellWidth } from "@patternfly/react-table";
import { useErrorHandler } from "react-error-boundary";
import _ from "lodash";

export const UserGroups = () => {
  const { t } = useTranslation("roles");
  const { addAlert } = useAlerts();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());
  const handleError = useErrorHandler();

  const [selectedGroup, setSelectedGroup] = useState<GroupRepresentation>();
  const [listGroups, setListGroups] = useState(true);
  const [search, setSearch] = useState("");
  const [username, setUsername] = useState("");

  const [isDirectMembership, setDirectMembership] = useState(false);
  const [open, setOpen] = useState(false);

  const adminClient = useAdminClient();
  const { id } = useParams<{ id: string }>();
  const alphabetize = (groupsList: GroupRepresentation[]) => {
    return _.sortBy(groupsList, (group) => group.path?.toUpperCase());
  };

  const loader = async (first?: number, max?: number, search?: string) => {
    const params: { [name: string]: string | number } = {
      first: first!,
      max: max!,
    };

    const user = await adminClient.users.findOne({ id });
    setUsername(user.username!);

    const searchParam = search || "";
    if (searchParam) {
      params.search = searchParam;
      setSearch(searchParam);
    }

    if (!searchParam && !listGroups) {
      return [];
    }

    const joinedGroups = await adminClient.users.listGroups({ ...params, id });

    // only returns the first 100 groups
    const allCreatedGroups = await adminClient.groups.find();

    const getAllPaths = joinedGroups.reduce(
      (acc: string[], cur) => (cur.path && acc.push(cur.path), acc),
      []
    );
    const parentGroupNames: string[] = [];
    const allGroupMembership: string[] = [];
    const slicedGroups: string[] = [];
    const rootLevelGroups: GroupRepresentation[] = [...allCreatedGroups];
    const allPaths: GroupRepresentation[] = [...rootLevelGroups];


      console.log("aaaaa", rootLevelGroups)

    console.log("getallPaths", getAllPaths)

    getAllPaths.forEach((item) => {

      // console.log(item.split("/")[getAllPaths.length - 2])
      // console.log(item.split("/")[getAllPaths.length - 2])


      const paths = item.split("/");
      const groups: string[] = [];
      // for (let i = 0; i < paths.length; i++) {
      //   groups.push((i > 0 ? groups[i - 1] : '') + "/" + paths[i]);
      // }

      paths.reduce((acc, value) => {
        const path = acc + "/" + value;
        groups.push(path);
        return path;
     }, '');

    for (let i = 1; i < groups.length; i++) {
      // console.log(groups[i].substring(1))
        slicedGroups.push(groups[i].substring(1));

      }


      // for (let i = 1; i <= 2; i++) {
      //   console.log(item.split("/")[i])
      //   parentGroupNames.push(item.split("/")[i])
      // }
    }
    );

    allGroupMembership.push(...slicedGroups)
    console.log("test", slicedGroups);

    console.log("all cerated groups ", allCreatedGroups)

    // const addSubgroups = (subgroups: GroupRepresentation[]) => {
      // allPaths.forEach((item) => {
      //   console.log(item.subGroups)
      //   if (item.subGroups) {
      //     allPaths.push(...item!.subGroups!);
      //     addSubgroups(item.subGroups);
      //   }
      // })
    // }

    allPaths.forEach((item) => {
      console.log(item.subGroups)
      if (item.subGroups!.length !== 0) {
        allPaths.push(...item!.subGroups!)
      }
    })

    // const omg = allGroupMembership.filter(value => allGroupMembership.forEach.includes(value));

    console.log("allGroupMembership paths", allGroupMembership)
    // console.log("parentGroupNames", parentGroupNames)

    console.log("this should have everything", allPaths)

    const topLevelGroups = allCreatedGroups.filter((value) =>
      parentGroupNames.includes(value.name!)
    );


    


    const subGroups = topLevelGroups.forEach((group) => console.log(group.subGroups))
    console.log("subgroups", subGroups)

    const subgroupArray: any[] = []
    
    topLevelGroups.forEach((group) => subgroupArray.push(group.subGroups))

    const flattenedSubgroupArray = [].concat(...subgroupArray);

    console.log("array of subgroups", flattenedSubgroupArray)
    

    console.log("allgroups", allCreatedGroups)

    console.log("toplevelgroups", topLevelGroups)



    const directMembership = joinedGroups.filter(
      (value) => !topLevelGroups.includes(value)
    );

    console.log("directMembership", directMembership)
    console.log("topLevelGroups", topLevelGroups)

    const allJoinedGroups = [...topLevelGroups, ...directMembership, ...flattenedSubgroupArray];

    const filterDupesfromGroups = allJoinedGroups.filter(
      (thing, index, self) =>
        index === self.findIndex((t) => t.name === thing.name)
    );

    if (isDirectMembership) {
      return alphabetize(directMembership);
    }

    return alphabetize(filterDupesfromGroups);
  };

  useEffect(() => {
    return asyncStateFetch(
      () => {
        return Promise.resolve(adminClient.users.listGroups({ id }));
      },
      (response) => {
        setListGroups(!!(response && response.length > 0));
      },
      handleError
    );
  });

  useEffect(() => {
    refresh();
  }, [isDirectMembership]);

  const AliasRenderer = (group: GroupRepresentation) => {
    return <>{group.name}</>;
  };

  const LeaveButtonRenderer = (group: GroupRepresentation) => {
    return (
      <>
        <Button onClick={() => leave(group)} variant="link">
          {t("users:Leave")}
        </Button>
      </>
    );
  };

  const toggleModal = () => setOpen(!open);

  const [toggleDeleteDialog, DeleteConfirm] = useConfirmDialog({
    titleKey: t("users:leaveGroup", {
      name: selectedGroup?.name,
    }),
    messageKey: t("users:leaveGroupConfirmDialog", {
      groupname: selectedGroup?.name,
      username: username,
    }),
    continueButtonLabel: "users:leave",
    continueButtonVariant: ButtonVariant.danger,
    onConfirm: async () => {
      try {
        await adminClient.users.delFromGroup({
          id,
          groupId: selectedGroup!.id!,
        });
        refresh();
        addAlert(t("users:removedGroupMembership"), AlertVariant.success);
      } catch (error) {
        addAlert(
          t("users:removedGroupMembershipError", { error }),
          AlertVariant.danger
        );
      }
    },
  });

  const leave = (group: GroupRepresentation) => {
    setSelectedGroup(group);
    toggleDeleteDialog();
  };

  return (
    <>
      <PageSection variant="light">
        <DeleteConfirm />
        <KeycloakDataTable
          key={key}
          loader={loader}
          isPaginated
          ariaLabelKey="roles:roleList"
          searchPlaceholderKey="groups:searchGroup"
          canSelectAll
          onSelect={() => {}}
          toolbarItem={
            <>
              <Button
                className="kc-join-group-button"
                key="join-group-button"
                onClick={() => toggleModal()}
                data-testid="add-group-button"
              >
                {t("users:joinGroup")}
              </Button>
              <Checkbox
                label={t("users:directMembership")}
                key="direct-membership-check"
                id="kc-direct-membership-checkbox"
                onChange={() => setDirectMembership(!isDirectMembership)}
                isChecked={isDirectMembership}
              />
            </>
          }
          columns={[
            {
              name: "groupMembership",
              displayKey: "users:groupMembership",
              cellRenderer: AliasRenderer,
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(40)],
            },
            {
              name: "path",
              displayKey: "users:Path",
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(45)],
            },
            {
              name: "",
              cellRenderer: LeaveButtonRenderer,
              cellFormatters: [emptyFormatter()],
              transforms: [cellWidth(20)],
            },
          ]}
          emptyState={
            !search ? (
              <ListEmptyState
                hasIcon={true}
                message={t("users:noGroups")}
                instructions={t("users:noGroupsText")}
                primaryActionText={t("users:joinGroup")}
                onPrimaryAction={() => {}}
              />
            ) : (
              ""
            )
          }
        />
      </PageSection>
    </>
  );
};
