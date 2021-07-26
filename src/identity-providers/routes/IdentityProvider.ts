import type { LocationDescriptorObject } from "history";
import { lazy } from "react";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";
import { IdentityProviderCrumb } from "../add/AddIdentityProvider";

export type IdentityProviderParams = {
  realm: string;
  id: string;
};

export const IdentityProviderRoute: RouteDef = {
  path: "/:realm/identity-providers/:id",
  component: lazy(() => import("../add/AddIdentityProvider")),
  breadcrumb: () => IdentityProviderCrumb,
  access: "manage-identity-providers",
};

export const toIdentityProvider = (
  params: IdentityProviderParams
): LocationDescriptorObject => ({
  pathname: generatePath(IdentityProviderRoute.path, params),
});
