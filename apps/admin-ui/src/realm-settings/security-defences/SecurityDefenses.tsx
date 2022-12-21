import { useTranslation } from "react-i18next";
import { PageSection, Tab, TabTitleText } from "@patternfly/react-core";

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { HeadersForm } from "./HeadersForm";
import { BruteForceDetection } from "./BruteForceDetection";
import {
  SecurityDefensesSubTab,
  toSecurityDefensesTab,
} from "../routes/SecurityDefenses";
import {
  routableTab,
  RoutableTabs,
} from "../../components/routable-tabs/RoutableTabs";
import { useHistory } from "react-router";
import { useRealm } from "../../context/realm-context/RealmContext";

type SecurityDefensesProps = {
  realm: RealmRepresentation;
  save: (realm: RealmRepresentation) => void;
};

export const SecurityDefenses = ({ realm, save }: SecurityDefensesProps) => {
  const { t } = useTranslation("realm-settings");
  const { realm: realmName } = useRealm();
  const history = useHistory();

  const securityDefensesRoute = (tab: SecurityDefensesSubTab) =>
    routableTab({
      to: toSecurityDefensesTab({ realm: realmName, tab }),
      history,
    });

  return (
    <RoutableTabs
      mountOnEnter
      unmountOnExit
      defaultLocation={toSecurityDefensesTab({
        realm: realmName,
        tab: "headers",
      })}
    >
      <Tab
        id="headers"
        title={<TabTitleText>{t("headers")}</TabTitleText>}
        {...securityDefensesRoute("headers")}
      >
        <PageSection variant="light">
          <HeadersForm realm={realm} save={save} />
        </PageSection>
      </Tab>
      <Tab
        id="bruteForce"
        title={<TabTitleText>{t("bruteForceDetection")}</TabTitleText>}
        {...securityDefensesRoute("brute-force-detection")}
      >
        <PageSection variant="light">
          <BruteForceDetection realm={realm} save={save} />
        </PageSection>
      </Tab>
    </RoutableTabs>
  );
};
