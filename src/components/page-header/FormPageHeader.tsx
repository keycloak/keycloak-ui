import React, { useContext } from "react";
import {
  PageSection,
  Text,
  TextContent,
  Divider,
} from "@patternfly/react-core";
import { WithTranslation } from "react-i18next";
import { HelpContext } from "../help-enabler/HelpHeader";

export interface FormPageHeaderProps extends WithTranslation {
  titleKey: string;
  subKey: string;
}

export const FormPageHeader = ({
  t,
  titleKey,
  subKey,
}: FormPageHeaderProps) => {
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
