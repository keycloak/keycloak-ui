import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";
import { AddIdentityProvider } from "../add/AddIdentityProvider";
import { DetailSettings } from "../add/DetailSettings";

type IdentityProviderTabs = "settings" | "mappers";

export type IdentityProviderCreateParams = {
  realm: string;
  providerId?: string;
};

export type IdentityProviderParams = IdentityProviderCreateParams & {
  alias: string;
  tab: IdentityProviderTabs;
};

export const IdentityProviderRoute: RouteDef = {
  path: "/:realm/identity-providers/:providerId/:alias/:tab",
  component: DetailSettings,
  breadcrumb: (t) => t("identity-providers:providerDetails"),
  access: "manage-identity-providers",
};

export const IdentityProviderCreateRoute: RouteDef = {
  path: "/:realm/identity-providers/:providerId/add",
  component: AddIdentityProvider,
  breadcrumb: (t) => t("identity-providers:addProvider"),
  access: "manage-identity-providers",
};

export const toIdentityProvider = (
  params: IdentityProviderParams
): LocationDescriptorObject => ({
  pathname: generatePath(IdentityProviderRoute.path, params),
});

export const toIdentityProviderCreate = (
  params: IdentityProviderCreateParams
): LocationDescriptorObject => ({
  pathname: generatePath(IdentityProviderCreateRoute.path, params),
});
