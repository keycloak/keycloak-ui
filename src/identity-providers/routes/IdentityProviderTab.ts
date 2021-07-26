import type { LocationDescriptorObject } from "history";
import { lazy } from "react";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";

export type IdentityProviderTab = "settings";

export type IdentityProviderTabParams = {
  realm: string;
  id: string;
  tab?: IdentityProviderTab;
};

export const IdentityProviderTabRoute: RouteDef = {
  path: "/:realm/identity-providers/:id/:tab?",
  component: lazy(() => import("../add/DetailSettings")),
  access: "manage-identity-providers",
};

export const toIdentityProviderTab = (
  params: IdentityProviderTabParams
): LocationDescriptorObject => ({
  pathname: generatePath(IdentityProviderTabRoute.path, params),
});
