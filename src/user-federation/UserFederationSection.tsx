import React, { useContext, useEffect, useState, setState } from "react";
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
  DropdownSeparator,
  Gallery,
  GalleryItem,
  KebabToggle,
  Label,
  PageSection,
  PageSectionVariants,
  Title,
  TitleSizes,
  ToolbarItem,
  TextContent
} from "@patternfly/react-core";

import { ExternalLinkAltIcon } from "@patternfly/react-icons";
import { useTranslation } from "react-i18next";
import "./user-federation.css";

import { ClientRepresentation } from "../realm/models/Realm";

import { RealmContext } from "../context/realm-context/RealmContext";
import { HttpClientContext } from "../context/http-service/HttpClientContext";

export const UserFederationSection = () => {
  const [providerOpen, isProviderMenuOpen] = useState(false);
  const [cardOpen, isCardMenuOpen] = useState(false);

  const { t } = useTranslation("userFederation");

  const httpClient = useContext(HttpClientContext)!;
  const { realm } = useContext(RealmContext);

  useEffect(() => {
    (async () => {
      const result = await httpClient.doGet<ClientRepresentation[]>(
        `/admin/realms/${realm}/client-scopes`
      );
      setRawData(result.data!);
    })();
  }, []);

  const ufAddProviderDropdownItems = [
    <DropdownItem key="itemLDAP">LDAP</DropdownItem>,
    <DropdownItem key="itemKerberos">Kerberos</DropdownItem>
  ];

  const ufCardDropdownItems = [
    <DropdownItem key="itemDelete">Delete</DropdownItem>
  ];

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
      <Title headingLevel="h3" size={TitleSizes["2xl"]}>
          {t("common:userFederation")}
        </Title>
        <TextContent>{t("userFederation:userFederationInfo")}
          <Button 
            variant="link"
            icon={<ExternalLinkAltIcon />}
            iconPosition="right"
            component="a"
            href="http://www.google.com">
              {t("common:learnMore")}
          </Button>        
        </TextContent>
      <Dropdown
          // onSelect={this.onSelect}
          className="keycloak__user-federation__dropdown"
          toggle={
            <DropdownToggle onToggle={() => isProviderMenuOpen(!providerOpen)} isPrimary id="ufToggleId">
              {t("userFederation:addNewProvider")}
            </DropdownToggle>
          }
          isOpen={providerOpen}
          dropdownItems={ufAddProviderDropdownItems}
        />
      </PageSection>
      <Divider />
      <PageSection>
        <Gallery hasGutter>
          <GalleryItem>
          <Card>
          <CardHeader>
            <CardActions>
              <Dropdown
                isPlain
                position={"right"}
                // onSelect={() => isCardMenuOpen(!cardOpen)}
                toggle={<KebabToggle onToggle={() => isCardMenuOpen(!cardOpen)} />}
                isOpen={cardOpen}
                dropdownItems={ufCardDropdownItems}
                />
            </CardActions>
            <CardTitle>LDAP-testing-1</CardTitle>
          </CardHeader>

          <CardBody></CardBody>
          <CardFooter>
            LDAP
            <Label color="blue" className="keycloak__user-federation__provider-label">Enabled</Label>
          </CardFooter>
        </Card>
          </GalleryItem>
          <GalleryItem>
          <Card>
          <CardHeader>
            <CardActions>
              <Dropdown
                // onSelect={() => isCardMenuOpen(!cardOpen)}
                toggle={<KebabToggle onToggle={() => isCardMenuOpen(!cardOpen)} />}
                isOpen={cardOpen}
                isPlain
                dropdownItems={ufCardDropdownItems}
                position={"right"}
              />
            </CardActions>
            <CardTitle>LDAP-testing-2</CardTitle>
          </CardHeader>
          <CardBody></CardBody>
          <CardFooter>
            LDAP
            <Label color="blue" className="keycloak__user-federation__provider-label">Enabled</Label>
          </CardFooter>
        </Card>

          </GalleryItem>
          <GalleryItem>
          <Card>
          <CardHeader>
            <CardActions>
              <Dropdown
                // onSelect={() => isCardMenuOpen(!cardOpen)}
                toggle={<KebabToggle onToggle={() => isCardMenuOpen(!cardOpen)} />}
                isOpen={cardOpen}
                isPlain
                dropdownItems={ufCardDropdownItems}
                position={"right"}
              />
            </CardActions>
            <CardTitle>LDAP-testing-3</CardTitle>
          </CardHeader>
          <CardBody></CardBody>
          <CardFooter>
            LDAP
            <Label color="blue" className="keycloak__user-federation__provider-label">Enabled</Label>
          </CardFooter>
        </Card>

          </GalleryItem>
        </Gallery>
      </PageSection>
    </>
  );
};
