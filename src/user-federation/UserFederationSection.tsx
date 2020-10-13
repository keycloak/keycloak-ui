import React, { useContext, useState, setState } from "react";
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
// import { ViewHeader } from "../components/view-header/ViewHeader";   // can't use this because of drop-down button in header
import { useTranslation } from "react-i18next";
import "./user-federation.css";


export const UserFederationSection = () => {
  const [open, isOpen] = useState(false);
  const { t } = useTranslation("client-scopes");

  // const { isOpen } = this.state;
  const dropdownItems = [
    <DropdownItem key="link">Link</DropdownItem>,
    <DropdownItem key="action" component="button">
      Action
    </DropdownItem>,
    <DropdownItem key="disabled link" isDisabled>
      Disabled Link
    </DropdownItem>,
    <DropdownItem key="disabled action" isDisabled component="button">
      Disabled Action
    </DropdownItem>,
    <DropdownSeparator key="separator" />,
    <DropdownItem key="separated link">Separated Link</DropdownItem>,
    <DropdownItem key="separated action" component="button">
      Separated Action
    </DropdownItem>
  ];

  const ufTypeDropdownItems = [
    <DropdownItem key="itemLDAP">LDAP</DropdownItem>,
    <DropdownItem key="itemKerberos">Kerberos</DropdownItem>
  ];

  // const onToggle = isOpen => {
  //   setState({
  //     isOpen
  //   });
  // };

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <Title headingLevel="h3" size={TitleSizes["2xl"]}>
          {t("common:userFederation")}
        </Title>
        <TextContent>{t("userFederation:userFederationInfo")}</TextContent>
        {/* <Button>Add new provider</Button> */}
        <Dropdown
          // onSelect={this.onSelect}
          className="keycloak__user-federation__dropdown"
          toggle={
            <DropdownToggle onToggle={() => isOpen(!open)} isPrimary id="ufToggleId">
              {t("userFederation:addNewProvider")}
            </DropdownToggle>
          }
          isOpen={open}
          dropdownItems={ufTypeDropdownItems}
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
                onSelect={() => isOpen(!open)}
                toggle={<KebabToggle onToggle={() => isOpen(!open)} />}
                isPlain
                dropdownItems={dropdownItems}
                position={"right"}
              />
            </CardActions>
            <CardTitle>LDAP-testing-1</CardTitle>
          </CardHeader>

          <CardBody></CardBody>
          <CardFooter>
            LDAP
            <Label color="blue">Enabled</Label>
          </CardFooter>
        </Card>
          </GalleryItem>
          <GalleryItem>
          <Card>
          <CardHeader>
            <CardActions>
              <Dropdown
                onSelect={() => isOpen(!open)}
                toggle={<KebabToggle onToggle={() => isOpen(!open)} />}
                isPlain
                dropdownItems={dropdownItems}
                position={"right"}
              />
            </CardActions>
            <CardTitle>LDAP-testing-2</CardTitle>
          </CardHeader>
          <CardBody></CardBody>
          <CardFooter>
            LDAP
            <Label color="blue">Enabled</Label>
          </CardFooter>
        </Card>

          </GalleryItem>
          <GalleryItem>
          <Card>
          <CardHeader>
            <CardActions>
              <Dropdown
                onSelect={() => isOpen(!open)}
                toggle={<KebabToggle onToggle={() => isOpen(!open)} />}
                isPlain
                dropdownItems={dropdownItems}
                position={"right"}
              />
            </CardActions>
            <CardTitle>LDAP-testing-3</CardTitle>
          </CardHeader>
          <CardBody></CardBody>
          <CardFooter>
            LDAP
            <Label color="blue">Enabled</Label>
          </CardFooter>
        </Card>

          </GalleryItem>
        </Gallery>
      </PageSection>
    </>
  );
};
