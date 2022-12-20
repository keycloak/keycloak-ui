import { lazy } from "react";
import type { Path } from "react-router-dom-v5-compat";
import { generatePath } from "react-router-dom-v5-compat";
import type { RouteDef } from "../../route-config";

export type UserRegistrationSubTab = "default-roles" | "default-groups";

export type UserRegistrationParams = {
  realm: string;
  tab: UserRegistrationSubTab;
};

export const UserRegistrationRoute: RouteDef = {
  path: "/:realm/realm-settings/user-registration/:tab",
  component: lazy(() => import("../RealmSettingsSection")),
  breadcrumb: (t) => t("realm-settings:userRegistration"),
  access: "view-realm",
};

export const toUserRegistrationTab = (
  params: UserRegistrationParams
): Partial<Path> => ({
  pathname: generatePath(UserRegistrationRoute.path, params),
});
