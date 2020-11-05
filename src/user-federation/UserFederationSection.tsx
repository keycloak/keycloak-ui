import React, { useContext, useEffect, useState } from "react";
import {
  AlertVariant,
  Button,
  Card,
  CardTitle,
  Divider,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Gallery,
  GalleryItem,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  TextContent,
  Title,
  TitleSizes,
} from "@patternfly/react-core";

import { UserFederationCard } from "./UserFederationCard";
import { useAlerts } from "../components/alert/Alerts";

import { DatabaseIcon, ExternalLinkAltIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import "./user-federation.css";

import { RealmContext } from "../context/realm-context/RealmContext";
import { HttpClientContext } from "../context/http-service/HttpClientContext";
import { UserFederationRepresentation } from "./model/userFederation";

export const UserFederationSection = () => {
  const [userFederations, setUserFederations] = useState<
    UserFederationRepresentation[]
  >();
  const { addAlert } = useAlerts();

  const loader = async () => {
    const testParams: { [name: string]: string | number } = {
      parentId: realm,
      type: "org.keycloak.storage.UserStorageProvider", // MF note that this is providerType in the output, but API call is still type
    };
    const result = await httpClient.doGet<UserFederationRepresentation[]>(
      `/admin/realms/${realm}/components`,
      {
        params: testParams,
      }
    );
    setUserFederations(result.data);
  };

  useEffect(() => {
    loader();
  }, []);

  const [providerOpen, isProviderMenuOpen] = useState(false);

  const { t } = useTranslation("user-federation");

  const httpClient = useContext(HttpClientContext)!;
  const { realm } = useContext(RealmContext);

  const ufAddProviderDropdownItems = [
    <DropdownItem key="itemLDAP">LDAP</DropdownItem>,
    <DropdownItem key="itemKerberos">Kerberos</DropdownItem>,
  ];

  let cards;

  if (userFederations) {
    cards = userFederations.map((userFederation, index) => {
      const ufCardDropdownItems = [
        <DropdownItem
          key={`${index}-cardDelete`}
          onClick={() => {
            try {
              httpClient
                .doDelete(
                  `/admin/realms/${realm}/components/${userFederation.id}`
                )
                .then(() => loader());
              addAlert(t("userFedDeletedSuccess"), AlertVariant.success);
            } catch (error) {
              addAlert(t("userFedDeleteError", { error }), AlertVariant.danger);
            }
          }}
        >
          {t("common:delete")}
        </DropdownItem>,
      ];

      return (
        <GalleryItem key={index}>
          <UserFederationCard
            id={userFederation.id}
            dropdownItems={ufCardDropdownItems}
            title={userFederation.name}
            providerId={userFederation.providerId}
            configEnabled={userFederation.config.enabled}
          />
        </GalleryItem>
      );
    });
  }

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h3" size={TitleSizes["2xl"]}>
          {t("common:userFederation")}
        </Title>
        <TextContent>
          {t("userFederationExplanation")}
          <Button
            variant="link"
            icon={<ExternalLinkAltIcon />}
            iconPosition="right"
            component="a"
            href="http://www.google.com"
          >
            {t("common:learnMore")}
          </Button>
        </TextContent>
        <Dropdown
          className="keycloak__user-federation__dropdown"
          toggle={
            <DropdownToggle
              onToggle={() => isProviderMenuOpen(!providerOpen)}
              isPrimary
              id="ufToggleId"
            >
              {t("addNewProvider")}
            </DropdownToggle>
          }
          isOpen={providerOpen}
          dropdownItems={ufAddProviderDropdownItems}
        />
      </PageSection>
      <Divider />
      <PageSection>
        {userFederations && userFederations.length > 0 ? (
          <Gallery hasGutter>{cards}</Gallery>
        ) : (
          <Gallery hasGutter>
            <Card isHoverable>
              <CardTitle>
                <Split hasGutter>
                  <SplitItem>
                    <DatabaseIcon size="lg" />
                  </SplitItem>
                  <SplitItem isFilled>{t("addKerberos")}</SplitItem>
                </Split>
              </CardTitle>
            </Card>
            <Card isHoverable>
              <CardTitle>
                <Split hasGutter>
                  <SplitItem>
                    <DatabaseIcon size="lg" />
                  </SplitItem>
                  <SplitItem isFilled>{t("addLdap")}</SplitItem>
                </Split>
              </CardTitle>
            </Card>
          </Gallery>
        )}
      </PageSection>
    </>
  );
};
