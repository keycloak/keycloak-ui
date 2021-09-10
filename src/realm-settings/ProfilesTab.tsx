import React from "react";
import { PageSection } from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { Divider, Flex, FlexItem, Radio, Title } from "@patternfly/react-core";
import { useAdminClient } from "../context/auth/AdminClient";
import { useRealm } from "../context/realm-context/RealmContext";
import "./RealmSettingsSection.css";

export const ProfilesTab = () => {
  const { t } = useTranslation("realm-settings");
  const adminClient = useAdminClient();
  const { realm: realmName } = useRealm();

  function onConfigTypeChange() {
    console.log(">>> onProfileConfigTypeChange");
  }

  const loader = async () => {
    const realmData = await adminClient.realms.findOne({
      realm: realmName,
    });

    console.log(realmData);
  };

  loader();

  return (
    <>
      <PageSection>
        <Flex className="kc-profiles-config-section">
          <FlexItem>
            <Title headingLevel="h1" size="md">
              {t("profilesConfigType")}
            </Title>
          </FlexItem>
          <FlexItem>
            <Radio
              isChecked={false}
              name="fromView"
              onChange={onConfigTypeChange}
              label={t("profilesConfigTypes.fromView")}
              id="fromView-radioBtn"
              value=""
            />
          </FlexItem>
          <FlexItem>
            <Radio
              isChecked={false}
              name="jsonEditor"
              onChange={onConfigTypeChange}
              label={t("profilesConfigTypes.jsonEditor")}
              id="jsonEditor-radioBtn"
              value=""
            />
          </FlexItem>
        </Flex>
      </PageSection>
      <Divider />
    </>
  );
};
