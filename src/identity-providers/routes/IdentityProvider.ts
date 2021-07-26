import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";
import { IdentityProviderCrumb } from "../add/AddIdentityProvider";
import { DetailSettings } from "../add/DetailSettings";

export type IdentityProviderTab = "settings";

export type IdentityProviderParams = {
  realm: string;
  id: string;
  tab: IdentityProviderTab;
};

export const IdentityProviderRoute: RouteDef = {
  path: "/:realm/identity-providers/:id/:tab",
  component: DetailSettings,
  breadcrumb: () => IdentityProviderCrumb,
  access: "manage-identity-providers",
};

export const toIdentityProvider = (
  params: IdentityProviderParams
): LocationDescriptorObject => ({
  pathname: generatePath(IdentityProviderRoute.path, params),
});
