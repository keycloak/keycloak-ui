import React from "react";
import { useTranslation } from "react-i18next";
import { AESGeneratedSettings } from "./AESGeneratedForm";

export const AESGeneratedCrumb = () => {
  const { t } = useTranslation();

  return <>{t("editProvider")}</>;
};

export type AESProviderTypeRouteParams = {
  realm: string;
  id: string;
  providerType: string;
};

export const AESProviderTypeRoute = {
  path: "/:realm/realm-settings/keys/:id/:providerType/settings",
  component: AESGeneratedSettings,
  breadcrumb: AESGeneratedCrumb,
  access: "view-realm",
};
