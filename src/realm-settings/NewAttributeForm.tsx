import { PageSection } from "@patternfly/react-core";
import React from "react";

import { useTranslation } from "react-i18next";
import { FormAccess } from "../components/form-access/FormAccess";
import "./RealmSettingsSection.css";

export default function NewAttributeForm() {
  const { t } = useTranslation("realm-settings");

  return (
    <PageSection variant="light">
      <FormAccess
        onSubmit={() => console.log("TODO handle submit")}
        isHorizontal
        role="view-realm"
        className="pf-u-mt-lg"
      >
        <p>{t("createAttribute")}</p>
      </FormAccess>
    </PageSection>
  );
}
