import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  CardHeader,
  CardActions,
  Divider,
  Dropdown,
  DropdownToggle,
  DropdownItem,
  Gallery,
  GalleryItem,
  KebabToggle,
  Label,
  PageSection,
  PageSectionVariants,
  Split,
  SplitItem,
  Title,
  TitleSizes,
  TextContent
} from "@patternfly/react-core";

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

  const loader = async () => {
    const testParams: { [name: string]: string | number } = {
      parentId: `${realm}`,
      type: "org.keycloak.storage.UserStorageProvider" // MF note that this is providerType in the output, but API call is still type
    };

    const result = await httpClient.doGet<UserFederationRepresentation[]>(
      `/admin/realms/${realm}/components`,
      {
        params: testParams
      }
    );
    setUserFederations(result.data);
    console.log(result.data);
  };

  useEffect(() => {
    loader();
  }, [0, 10]);

  const [providerOpen, isProviderMenuOpen] = useState(false);


  // MF HERE
  const [cardOpen, isCardMenuOpen] = useState(false);

  const { t } = useTranslation("userFederation");

  const httpClient = useContext(HttpClientContext)!;
  const { realm } = useContext(RealmContext);

  const ufAddProviderDropdownItems = [
    <DropdownItem key="itemLDAP">LDAP</DropdownItem>,
    <DropdownItem key="itemKerberos">Kerberos</DropdownItem>
  ];

  let cards;

  if (userFederations) {
    cards = userFederations.map((userFederation => {
      const ufCardDropdownItems = [
        <DropdownItem key={`${userFederation.id}-cardDelete`}>
          {t("common:delete")}
        </DropdownItem>
      ];
      // const currentProgress = userProgress[walkthrough.id];
      return (
        <GalleryItem id={userFederation.id} key={userFederation.id}>
          <Card>
            <CardHeader>
              <CardActions>
                <Dropdown
                  isPlain
                  position={"right"}
                  // onSelect={() => isCardMenuOpen(!cardOpen)}
                  toggle={
                    <KebabToggle onToggle={() => isCardMenuOpen(!cardOpen)} />
                  }
                  isOpen={cardOpen}
                  dropdownItems={ufCardDropdownItems}
                />
              </CardActions>
              <CardTitle>{userFederation.name}</CardTitle>
            </CardHeader>

            <CardBody></CardBody>
            <CardFooter>
              {userFederation.providerId === "ldap" ? "LDAP" : "Kerberos"}

              <Label
                color="blue"
                className="keycloak__user-federation__provider-label"
              >
                {userFederation.config.enabled
                  ? `${t("common:enabled")}`
                  : `${t("common:disabled")}`}
              </Label>
            </CardFooter>
          </Card>
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
          {t("userFederationInfo")}
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
          // onSelect={this.onSelect}
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
        {/* {(userFederations) && (
          <Bullseye>
            <Spinner />
          </Bullseye>
        )} */}
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
