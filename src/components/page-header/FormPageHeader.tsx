import React, { useContext } from "react";
import {
  PageSection,
  Text,
  TextContent,
  Divider,
} from "@patternfly/react-core";
import { useTranslation } from "react-i18next";
import { HelpContext } from "../help-enabler/HelpHeader";

type FormPageHeaderProps = {
  titleKey: string;
  subKey: string;
};

export const FormPageHeader = ({ titleKey, subKey }: FormPageHeaderProps) => {
  const { t } = useTranslation();
  const { enabled } = useContext(HelpContext);
  return (
    <>
      <PageSection variant="light">
        <TextContent>
          <Text component="h1">{t(titleKey)}</Text>
          {enabled && t(`help:${subKey}`)}
        </TextContent>
      </PageSection>
      <Divider />
    </>
  );
};
