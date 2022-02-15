import React from "react";
import { useTranslation } from "react-i18next";
import {
  ClipboardCopyButton,
  CodeBlock,
  CodeBlockAction,
  EmptyState,
  EmptyStateBody,
  TextArea,
  Title,
} from "@patternfly/react-core";

import type UserRepresentation from "@keycloak/keycloak-admin-client/lib/defs/userRepresentation";
import useToggle from "../../utils/useToggle";

type GeneratedCodeTabProps = {
  user?: UserRepresentation;
  text: string;
  label: string;
};

export const GeneratedCodeTab = ({
  text,
  user,
  label,
}: GeneratedCodeTabProps) => {
  const { t } = useTranslation("clients");
  const [copy, toggle] = useToggle();
  let timer: number | undefined = undefined;

  const copyToClipboard = (text: string) => {
    if (timer) {
      window.clearTimeout(timer);
    }
    navigator.clipboard.writeText(text);
    toggle();
    timer = window.setTimeout(() => {
      toggle();
      timer = undefined;
    }, 1000);
  };

  return (
    <>
      {user && (
        <CodeBlock
          id={label}
          actions={
            <CodeBlockAction>
              <ClipboardCopyButton
                id={`copy-button-${label}`}
                textId={label}
                aria-label={t("copyToClipboard")}
                onClick={() => copyToClipboard(text)}
                exitDelay={600}
                variant="plain"
              >
                {copy ? t("copySuccess") : t("copyToClipboard")}
              </ClipboardCopyButton>
            </CodeBlockAction>
          }
        >
          <TextArea id={`text-area-${label}`} rows={20} value={text} />
        </CodeBlock>
      )}
      {!user && (
        <EmptyState variant="large">
          <Title headingLevel="h4" size="lg">
            {t(`${label}No`)}
          </Title>
          <EmptyStateBody>{t(`${label}IsDisabled`)}</EmptyStateBody>
        </EmptyState>
      )}
    </>
  );
};
