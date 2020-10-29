import React, { useContext, useEffect, useState } from "react";
import {
  Bullseye,
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
  Spinner,
  Title,
  TitleSizes,
  TextContent
} from "@patternfly/react-core";

import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import "./user-federation.css";

import { RealmContext } from "../context/realm-context/RealmContext";
import { HttpClientContext } from "../context/http-service/HttpClientContext";
import { UserFederationRepresentation } from "./model/userFederation";

export const UserFederationSection = () => {
  const [userFederations, setUserFederations] = useState<UserFederationRepresentation[]>();

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
  const [cardOpen, isCardMenuOpen] = useState(false);

  const { t } = useTranslation("userFederation");

  const httpClient = useContext(HttpClientContext)!;
  const { realm } = useContext(RealmContext);

  const ufAddProviderDropdownItems = [
    <DropdownItem key="itemLDAP">LDAP</DropdownItem>,
    <DropdownItem key="itemKerberos">Kerberos</DropdownItem>
  ];

  const ufCardDropdownItems = [
    <DropdownItem key="itemDelete">{t("common:delete")}</DropdownItem>
  ];

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
        {!userFederations && (
          <Bullseye>
            <Spinner />
          </Bullseye>
        )}
        {userFederations && (
          <Gallery hasGutter>
            <GalleryItem>
              <Card>
                <CardHeader>
                  <CardActions>
                    <Dropdown
                      isPlain
                      position={"right"}
                      // onSelect={() => isCardMenuOpen(!cardOpen)}
                      toggle={
                        <KebabToggle
                          onToggle={() => isCardMenuOpen(!cardOpen)}
                        />
                      }
                      isOpen={cardOpen}
                      dropdownItems={ufCardDropdownItems}
                    />
                  </CardActions>
                  <CardTitle>{userFederations[0].name}</CardTitle>
                </CardHeader>

                <CardBody></CardBody>
                <CardFooter>
                  {userFederations[0].providerId === "ldap"
                    ? "LDAP"
                    : "Kerberos"}

                  <Label
                    color="blue"
                    className="keycloak__user-federation__provider-label"
                  >
                    {userFederations[0].config.enabled ? `${t("common:enabled")}` : `${t("common:disabled")}`}
                  </Label>
                </CardFooter>
              </Card>
            </GalleryItem>
            <GalleryItem>
              <Card>
                <CardHeader>
                  <CardActions>
                    <Dropdown
                      // onSelect={() => isCardMenuOpen(!cardOpen)}
                      toggle={
                        <KebabToggle
                          onToggle={() => isCardMenuOpen(!cardOpen)}
                        />
                      }
                      isOpen={cardOpen}
                      isPlain
                      dropdownItems={ufCardDropdownItems}
                      position={"right"}
                    />
                  </CardActions>
                  <CardTitle>{userFederations[1].name}</CardTitle>
                </CardHeader>
                <CardBody></CardBody>
                <CardFooter>
                  {userFederations[1].providerId === "ldap"
                    ? "LDAP"
                    : "Kerberos"}
                  <Label
                    color="blue"
                    className="keycloak__user-federation__provider-label"
                  >
                    {userFederations[1].config.enabled ? `${t("common:enabled")}` : `${t("common:disabled")}`}
                  </Label>
                </CardFooter>
              </Card>
            </GalleryItem>
            <GalleryItem>
              <Card>
                <CardHeader>
                  <CardActions>
                    <Dropdown
                      // onSelect={() => isCardMenuOpen(!cardOpen)}
                      toggle={
                        <KebabToggle
                          onToggle={() => isCardMenuOpen(!cardOpen)}
                        />
                      }
                      isOpen={cardOpen}
                      isPlain
                      dropdownItems={ufCardDropdownItems}
                      position={"right"}
                    />
                  </CardActions>
                  <CardTitle>{userFederations[2].name}</CardTitle>
                </CardHeader>
                <CardBody></CardBody>
                <CardFooter>
                  {userFederations[2].providerId === "ldap"
                    ? "LDAP"
                    : "Kerberos"}
                  <Label
                    color="blue"
                    className="keycloak__user-federation__provider-label"
                  >
                    {userFederations[2].config.enabled ? `${t("common:enabled")}` : `${t("common:disabled")}`}
                  </Label>
                </CardFooter>
              </Card>
            </GalleryItem>
          </Gallery>
        )}
      </PageSection>
    </>
  );
};
