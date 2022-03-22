import React from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  ClipboardCopy,
  FormGroup,
  Split,
  SplitItem,
} from "@patternfly/react-core";
import type { UseFormMethods } from "react-hook-form";
import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";

export type ClientSecretProps = {
  secret: string;
  toggle: () => void;
  form: UseFormMethods<ClientRepresentation>;
};

export const ClientSecret = ({ secret, toggle, form }: ClientSecretProps) => {
  const { t } = useTranslation("clients");

  console.log(form.getValues());

  return (
    <FormGroup label={t("clientSecret")} fieldId="kc-client-secret">
      <Split hasGutter>
        <SplitItem isFilled>
          <ClipboardCopy id="kc-client-secret" isReadOnly>
            {secret}
          </ClipboardCopy>
        </SplitItem>
        <SplitItem>
          <Button
            variant="secondary"
            onClick={toggle}
            isDisabled={form.formState.isDirty}
          >
            {t("regenerate")}
          </Button>
        </SplitItem>
      </Split>
    </FormGroup>
  );
};
