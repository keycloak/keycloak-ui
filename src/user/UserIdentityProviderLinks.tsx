import React from "react";
import { useTranslation } from "react-i18next";
import { PageSection, Text, TextContent } from "@patternfly/react-core";
import { FormPanel } from "../components/scroll-form/FormPanel";

export const UserIdentityProviderLinks = () => {
  const { t } = useTranslation("users");
  return (
    <>
      <PageSection variant="light">
        <FormPanel title={t("linkedIdPs")} className="kc-linked-idps">
          <TextContent>
            <Text className="kc-available-idps-text">
              {t("linkedIdPsText")}
            </Text>
          </TextContent>
        </FormPanel>
        <FormPanel className="kc-available-idps" title={t("availableIdPs")}>
          <TextContent>
            <Text className="kc-available-idps-text">
              {t("availableIdPsText")}
            </Text>
          </TextContent>
        </FormPanel>
      </PageSection>
    </>
  );
};
