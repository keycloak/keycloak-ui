import React, { ReactElement, useState } from "react";
import {
  Card,
  CardHeader,
  CardActions,
  CardTitle,
  CardBody,
  CardFooter,
  Dropdown,
  KebabToggle,
  Label,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";

export type UserFederationCardProps = {
  title: string;
  providerId: string;
  id: string;
  dropdownItems: ReactElement[];
  configEnabled: boolean;
};

export const UserFederationCard = ({
  dropdownItems,
  title,
  providerId,
  configEnabled,
}: UserFederationCardProps) => {
  const { t } = useTranslation();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const onDropdownToggle = () => {
    setDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <Card>
        <CardHeader>
          <CardActions>
            <Dropdown
              isPlain
              position={"right"}
              toggle={<KebabToggle onToggle={onDropdownToggle} />}
              isOpen={isDropdownOpen}
              dropdownItems={dropdownItems}
            />
          </CardActions>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardBody />
        <CardFooter>
          {providerId === "ldap" ? "LDAP" : "Kerberos"}
          <Label
            color="blue"
            className="keycloak__user-federation__provider-label"
          >
            {configEnabled
              ? `${t("common:enabled")}`
              : `${t("common:disabled")}`}
          </Label>
        </CardFooter>
      </Card>
    </>
  );
};
