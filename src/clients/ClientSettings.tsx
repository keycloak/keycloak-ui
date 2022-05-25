import React from "react";
import { useTranslation } from "react-i18next";
import { useFormContext } from "react-hook-form";
import { Form } from "@patternfly/react-core";

import type ClientRepresentation from "@keycloak/keycloak-admin-client/lib/defs/clientRepresentation";
import { ScrollForm } from "../components/scroll-form/ScrollForm";
import { ClientDescription } from "./ClientDescription";
import { CapabilityConfig } from "./add/CapabilityConfig";
import { SamlConfig } from "./add/SamlConfig";
import { SamlSignature } from "./add/SamlSignature";
import { AccessSettings } from "./add/AccessSettings";
import { LoginSettingsPanel } from "./add/LoginSettingsPanel";
import { LogoutPanel } from "./add/LogoutPanel";

export type ClientSettingsProps = {
  client: ClientRepresentation;
  save: () => void;
  reset: () => void;
};

export const ClientSettings = (props: ClientSettingsProps) => {
  const { t } = useTranslation("clients");

  const { watch } = useFormContext<ClientRepresentation>();
  const protocol = watch("protocol");

  const { client } = props;
        ...result,
        "samlCapabilityConfig",
        "signatureAndEncryption",
        "loginSettings",
      ];

  return (
    <ScrollForm
      className="pf-u-px-lg"
      sections={[
        {
          title: t("generalSettings"),
          panel: (
            <Form isHorizontal>
              <ClientDescription protocol={client.protocol} />
          protocol={client.protocol}
          hasConfigureAccess={client.access?.configure}
        />
            </Form>
          ),
        },
        {
          title: t("accessSettings"),
          panel: <AccessSettings {...props} />,
        },
        {
          title: t("samlCapabilityConfig"),
          isHidden: protocol !== "saml" || client.bearerOnly,
          panel: <SamlConfig />,
        },
        {
          title: t("signatureAndEncryption"),
          isHidden: protocol !== "saml" || client.bearerOnly,
          panel: <SamlSignature />,
        },
        {
          title: t("capabilityConfig"),
          isHidden: protocol !== "openid-connect" || client.bearerOnly,
          panel: <CapabilityConfig />,
        },
        {
          title: t("loginSettings"),
          isHidden: protocol !== "openid-connect" || client.bearerOnly,
          panel: <LoginSettingsPanel />,
        },
        {
          title: t("logoutSettings"),
          isHidden: client.bearerOnly,
          panel: <LogoutPanel {...props} />,
        },
        isHorizontal
        role="manage-clients"
        fineGrainedAccess={client.access?.configure}
      >
      ]}
        {protocol === "saml" && (
          <SaveReset
            className="keycloak__form_actions"
            name="settings"
            save={save}
            reset={reset}
            isActive={isManager}
          />
        )}
        isHorizontal
        role="manage-clients"
        fineGrainedAccess={client.access?.configure}
      >
    />
  );
};
