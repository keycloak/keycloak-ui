import React from "react";
import { useHistory } from "react-router-dom";
import { Trans, useTranslation } from "react-i18next";
import { xor } from "lodash-es";
import {
  Brand,
  Card,
  CardBody,
  CardTitle,
  DescriptionList,
  DescriptionListDescription,
  DescriptionListGroup,
  DescriptionListTerm,
  EmptyState,
  EmptyStateBody,
  Grid,
  GridItem,
  Label,
  List,
  ListItem,
  ListVariant,
  PageSection,
  Tab,
  TabTitleText,
  Text,
  TextContent,
  Title,
} from "@patternfly/react-core";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@patternfly/react-table";

import { useRealm } from "../context/realm-context/RealmContext";
import { useServerInfo } from "../context/server-info/ServerInfoProvider";
import { toUpperCase } from "../util";
import { HelpItem } from "../components/help-enabler/HelpItem";
import environment from "../environment";
import { KeycloakSpinner } from "../components/keycloak-spinner/KeycloakSpinner";
import {
  routableTab,
  RoutableTabs,
} from "../components/routable-tabs/RoutableTabs";
import { DashboardTabs, toDashboard } from "./routes/Dashboard";

import "./dashboard.css";

const EmptyDashboard = () => {
  const { t } = useTranslation("dashboard");
  const { realm } = useRealm();
  return (
    <PageSection variant="light">
      <EmptyState variant="large">
        <Brand
          src={environment.resourceUrl + "/icon.svg"}
          alt="Keycloak icon"
          className="keycloak__dashboard_icon"
        />
        <Title headingLevel="h4" size="3xl">
          {t("welcome")}
        </Title>
        <Title headingLevel="h4" size="4xl">
          {realm}
        </Title>
        <EmptyStateBody>{t("introduction")}</EmptyStateBody>
      </EmptyState>
    </PageSection>
  );
};

const Dashboard = () => {
  const { t } = useTranslation("dashboard");
  const { realm } = useRealm();
  const serverInfo = useServerInfo();
  const history = useHistory();

  const enabledFeatures = xor(
    serverInfo.profileInfo?.disabledFeatures,
    serverInfo.profileInfo?.experimentalFeatures,
    serverInfo.profileInfo?.previewFeatures
  );

  const isExperimentalFeature = (feature: string) =>
    serverInfo.profileInfo?.experimentalFeatures?.includes(feature);

  const isPreviewFeature = (feature: string) =>
    serverInfo.profileInfo?.previewFeatures?.includes(feature);

  if (Object.keys(serverInfo).length === 0) {
    return <KeycloakSpinner />;
  }

  const route = (tab: DashboardTabs) =>
    routableTab({
      to: toDashboard({
        realm,
        tab,
      }),
      history,
    });

  return (
    <>
      <PageSection variant="light">
        <TextContent className="pf-u-mr-sm">
          <Text component="h1">
            {t("realmName", { name: toUpperCase(realm) })}
          </Text>
          <Text>
            <Trans t={t} i18nKey="adminUiVersion">
              <strong>Admin UI version</strong>
              {{ version: environment.commitHash }}
            </Trans>
          </Text>
        </TextContent>
      </PageSection>
      <PageSection variant="light" className="pf-u-p-0">
        <RoutableTabs
          data-testid="dashboard-tabs"
          defaultLocation={toDashboard({
            realm,
            tab: "info",
          })}
          isBox
          mountOnEnter
        >
          <Tab
            id="info"
            data-testid="infoTab"
            title={<TabTitleText>{t("realmInfo")}</TabTitleText>}
            {...route("info")}
          >
            <PageSection variant="light">
              <Grid hasGutter>
                <GridItem lg={2} sm={12}>
                  <Card className="keycloak__dashboard_card">
                    <CardTitle>{t("serverInfo")}</CardTitle>
                    <CardBody>
                      <DescriptionList>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("version")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {serverInfo.systemInfo?.version}
                          </DescriptionListDescription>
                          <DescriptionListTerm>
                            {t("product")}
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            {toUpperCase(serverInfo.profileInfo?.name!)}
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem lg={10} sm={12}>
                  <Card className="keycloak__dashboard_card">
                    <CardTitle>{t("profile")}</CardTitle>
                    <CardBody>
                      <DescriptionList>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("enabledFeatures")}{" "}
                            <HelpItem
                              fieldLabelId="dashboard:enabledFeatures"
                              helpText="dashboard:infoEnabledFeatures"
                            />
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            <List variant={ListVariant.inline}>
                              {enabledFeatures.map((feature) => (
                                <ListItem key={feature}>
                                  {feature}{" "}
                                  {isExperimentalFeature(feature) ? (
                                    <Label color="orange">
                                      {t("experimental")}
                                    </Label>
                                  ) : null}
                                  {isPreviewFeature(feature) ? (
                                    <Label color="blue">{t("preview")}</Label>
                                  ) : null}
                                </ListItem>
                              ))}
                            </List>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                        <DescriptionListGroup>
                          <DescriptionListTerm>
                            {t("disabledFeatures")}{" "}
                            <HelpItem
                              fieldLabelId="dashboard:disabledFeatures"
                              helpText="dashboard:infoDisabledFeatures"
                            />
                          </DescriptionListTerm>
                          <DescriptionListDescription>
                            <List variant={ListVariant.inline}>
                              {serverInfo.profileInfo?.disabledFeatures?.map(
                                (feature) => (
                                  <ListItem key={feature}>{feature}</ListItem>
                                )
                              )}
                            </List>
                          </DescriptionListDescription>
                        </DescriptionListGroup>
                      </DescriptionList>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
            </PageSection>
          </Tab>
          <Tab
            id="providers"
            data-testid="providersTab"
            title={<TabTitleText>{t("providerInfo")}</TabTitleText>}
            {...route("providers")}
          >
            <PageSection variant="light">
              <TableComposable variant="compact">
                <Thead>
                  <Tr>
                    <Th width={20}>{t("spi")}</Th>
                    <Th>{t("providers")}</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {Object.keys(serverInfo.providers || []).map((name) => (
                    <Tr key={name}>
                      <Td>{name}</Td>
                      <Td>
                        <ul>
                          {Object.keys(
                            serverInfo.providers?.[name].providers || []
                          ).map((value) => (
                            <li key={value}>{value}</li>
                          ))}
                        </ul>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </TableComposable>
              <ul></ul>
            </PageSection>
          </Tab>
        </RoutableTabs>
      </PageSection>
    </>
  );
};

export default function DashboardSection() {
  const { realm } = useRealm();
  const isMasterRealm = realm === "master";
  return (
    <>
      {!isMasterRealm && <EmptyDashboard />}
      {isMasterRealm && <Dashboard />}
    </>
  );
}
