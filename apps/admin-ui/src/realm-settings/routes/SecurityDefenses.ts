import { lazy } from "react";
import type { Path } from "react-router-dom-v5-compat";
import { generatePath } from "react-router-dom-v5-compat";
import type { RouteDef } from "../../route-config";

export type SecurityDefensesSubTab = "headers" | "brute-force-detection";

export type SecurityDefensesParams = {
  realm: string;
  tab: SecurityDefensesSubTab;
};

export const SecurityDefensesRoute: RouteDef = {
  path: "/:realm/realm-settings/security-defenses/:tab",
  component: lazy(() => import("../RealmSettingsSection")),
  breadcrumb: (t) => t("realm-settings:securityDefences"),
  access: "view-realm",
};

export const toSecurityDefensesTab = (
  params: SecurityDefensesParams
): Partial<Path> => ({
  pathname: generatePath(SecurityDefensesRoute.path, params),
});
