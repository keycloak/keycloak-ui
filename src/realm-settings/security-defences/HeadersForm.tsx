import React from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { ActionGroup, Button } from "@patternfly/react-core";

import type RealmRepresentation from "@keycloak/keycloak-admin-client/lib/defs/realmRepresentation";
import { FormAccess } from "../../components/form-access/FormAccess";
import { HelpLinkTextInput } from "./HelpLinkTextInput";

import "./security-defences.css";

type HeadersFormProps = {
  save: (realm: RealmRepresentation) => void;
  reset: () => void;
};

export const HeadersForm = ({ save, reset }: HeadersFormProps) => {
  const { t } = useTranslation();
  const {
    formState: { isDirty },
    handleSubmit,
  } = useFormContext();

  return (
    <FormAccess
      isHorizontal
      role="manage-realm"
      className="keycloak__security-defences__form"
      onSubmit={handleSubmit(save)}
    >
      <HelpLinkTextInput
        fieldName="browserSecurityHeaders.xFrameOptions"
        url="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options"
      />
      <HelpLinkTextInput
        fieldName="browserSecurityHeaders.contentSecurityPolicy"
        url="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy"
      />
      <HelpLinkTextInput
        fieldName="browserSecurityHeaders.contentSecurityPolicyReportOnly"
        url="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy-Report-Only"
      />
      <HelpLinkTextInput
        fieldName="browserSecurityHeaders.xContentTypeOptions"
        url="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Content-Type-Options"
      />
      <HelpLinkTextInput
        fieldName="browserSecurityHeaders.xRobotsTag"
        url="https://developers.google.com/search/docs/advanced/robots/robots_meta_tag"
      />
      <HelpLinkTextInput
        fieldName="browserSecurityHeaders.xXSSProtection"
        url="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-XSS-Protection"
      />
      <HelpLinkTextInput
        fieldName="browserSecurityHeaders.strictTransportSecurity"
        url="https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security"
      />

      <ActionGroup>
        <Button
          variant="primary"
          type="submit"
          data-testid="headers-form-tab-save"
          isDisabled={!isDirty}
        >
          {t("common:save")}
        </Button>
        <Button variant="link" onClick={reset}>
          {t("common:revert")}
        </Button>
      </ActionGroup>
    </FormAccess>
  );
};
