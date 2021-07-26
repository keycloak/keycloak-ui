import type { LocationDescriptorObject } from "history";
import { lazy } from "react";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";

export type RealmRoleParams = {
  realm: string;
  id: string;
  tab?: string;
};

export const RealmRoleRoute: RouteDef = {
  path: "/:realm/roles/:id/:tab?",
  component: lazy(() => import("../RealmRoleTabs")),
  breadcrumb: (t) => t("roles:roleDetails"),
  access: "view-realm",
};

export const toRealmRole = (
  params: RealmRoleParams
): LocationDescriptorObject => ({
  pathname: generatePath(RealmRoleRoute.path, params),
});
