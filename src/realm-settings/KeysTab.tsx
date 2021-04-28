import React, { useEffect, useState } from "react";
import { useHistory, useParams, useRouteMatch } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  AlertVariant,
  Button,
  ButtonVariant,
  Checkbox,
  Label,
  PageSection,
  ToolbarItem,
} from "@patternfly/react-core";
import RoleRepresentation from "keycloak-admin/lib/defs/roleRepresentation";
import RealmRepresentation from "keycloak-admin/lib/defs/realmRepresentation";
import KeysMetadataRepresentation, {
  KeyMetadataRepresentation,
} from "keycloak-admin/lib/defs/keyMetadataRepresentation";
import { ListEmptyState } from "../components/list-empty-state/ListEmptyState";
import { KeycloakDataTable } from "../components/table-toolbar/KeycloakDataTable";
import { useAlerts } from "../components/alert/Alerts";
import { useConfirmDialog } from "../components/confirm-dialog/ConfirmDialog";
import { emptyFormatter } from "../util";
import { useAdminClient } from "../context/auth/AdminClient";
import _ from "lodash";
import { useRealm } from "../context/realm-context/RealmContext";
import ComponentRepresentation from "keycloak-admin/lib/defs/componentRepresentation";

import "./RealmSettingsSection.css";

type KeyData = KeyMetadataRepresentation & {
  provider?: string;
};

type KeysTabProps = {
  keys: KeyData[];
  // addComposites: (newReps: RoleRepresentation[]) => void;
  realmComponents: ComponentRepresentation[];
  // onRemove: (newReps: RoleRepresentation[]) => void;
  // client?: ClientRepresentation;
};

export const KeysTab = ({ keys, realmComponents }: KeysTabProps) => {
  const { t } = useTranslation("roles");
  const history = useHistory();
  const { addAlert } = useAlerts();
  const { url } = useRouteMatch();
  const [key, setKey] = useState(0);
  const refresh = () => setKey(new Date().getTime());
  const { realm } = useRealm();

  const [selectedRows, setSelectedRows] = useState<RoleRepresentation[]>([]);
  const [isInheritedHidden, setIsInheritedHidden] = useState(false);
  const [allRoles, setAllRoles] = useState<RoleRepresentation[]>([]);
    const [allKeys, setAllKeys] = useState<KeyData[]>([]);

  const [open, setOpen] = useState(false);

  const adminClient = useAdminClient();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
      console.log("Testing 123")
    //   setAllKeys(keys);
      keys.map((key) => { 
        key.provider = realmComponents.find(
          (component) => component.id === key.providerId
        )?.name!;
      });
    //   console.log(x)
  })

  const loader = async () => {

    const keysMetaData = allKeys;
    
    console.log("keyz", allKeys);

    return keysMetaData.map((key) => { 
            key.provider = realmComponents.find(
              (component) => component.id === key.providerId
            )?.name!;
          });
  };

    // let f = 
    // keys.map((key) => { 
    //     key.provider = realmComponents.find(
    //       (component) => component.id === key.providerId
    //     )?.name!;
    //   });

    //   console.log(typeof f)

  //   keys.forEach((item) => {
  //       if (item.name === "ecdsa-generated" )
  //       console.log(item.config!.ecdsaEllipticCurveKey[0].slice(-3))
  //     }
  //       )
  //   keys.config!.ecdsaEllipticCurveKey.slice(-2)

  const toggleModal = () => setOpen(!open);

  const goToCreate = () => history.push(`${url}/add-role`);

  //   keys?.forEach((item) => {

  //     let x = adminClient.components.findOne({id: item.providerId!}).then((res) => console.log(res.name))
  //     console.log("sadsa", x)
  //      })

  const ProviderRenderer = ({provider}: KeyData) => {
    //   let p = adminClient.components.findOne({id: item.providerId!}).then(res => {return <>{res.name}</>})
    //   console.log("o", p)
    //     })
    //     return <>{adminClient.components.findOne({id: item.providerId!}).then(res => {return <>{res.name}</>})}</>;
    return <>{provider}</>;

};

  const ButtonRenderer = ({ name }: ComponentRepresentation) => {
    if (name === "ecdsa-generated") {
      return (
        <>
          <Button variant="secondary" id="kc-public-key">
            {t("realm-settings:publicKeys").slice(0, -1)}
          </Button>
        </>
      );
    } else if (name === "rsa-generated" || name === "fallback-RS256") {
      return (
        <>
          <Button variant="secondary" id="kc-rsa-public-key">
            {t("realm-settings:publicKeys").slice(0, -1)}
          </Button>
          <Button variant="secondary" id="kc-certificate">
            {t("realm-settings:certificate")}
          </Button>
        </>
      );
    }
  };

  return (
    <>
      <PageSection variant="light" padding={{ default: "noPadding" }}>
        <KeycloakDataTable
          key={key}
          loader={loader}
          ariaLabelKey="roles:roleList"
          searchPlaceholderKey="roles:searchFor"
          canSelectAll
          toolbarItem={
            <>
              <ToolbarItem>
                <Checkbox
                  label="Hide inherited roles"
                  key="associated-roles-check"
                  id="kc-hide-inherited-roles-checkbox"
                  onChange={() => setIsInheritedHidden(!isInheritedHidden)}
                  isChecked={isInheritedHidden}
                />
              </ToolbarItem>
              <ToolbarItem>
                <Button
                  key="add-role-button"
                  onClick={() => toggleModal()}
                  data-testid="add-role-button"
                >
                  {t("addRole")}
                </Button>
              </ToolbarItem>
            </>
          }
          columns={[
            {
              name: "algorithm",
              displayKey: "realm-settings:algorithm",
              //   cellRenderer: AlgRenderer,
              cellFormatters: [emptyFormatter()],
            },
            {
              name: "type",
              displayKey: "realm-settings:type",
              //   cellRenderer: TypeRenderer,
              cellFormatters: [emptyFormatter()],
            },
            {
              name: "kid",
              displayKey: "realm-settings:kid",
              cellFormatters: [emptyFormatter()],
            },

            {
              name: "provider",
              displayKey: "realm-settings:provider",
              cellRenderer: ProviderRenderer,
              cellFormatters: [emptyFormatter()],
            },
            {
              name: "publicKeys",
              displayKey: "realm-settings:publicKeys",
            //   cellRenderer: ButtonRenderer,
              cellFormatters: [emptyFormatter()],
            },
          ]}
          emptyState={
            <ListEmptyState
              hasIcon={true}
              message={t("noRoles")}
              instructions={t("noRolesInstructions")}
              primaryActionText={t("createRole")}
              onPrimaryAction={goToCreate}
            />
          }
        />
      </PageSection>
    </>
  );
};
