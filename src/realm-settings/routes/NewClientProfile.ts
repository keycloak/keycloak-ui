import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";
import { NewClientProfileForm } from "../NewClientProfileForm";
import { ProfilesTab } from "../ProfilesTab";

export type clientProfileParams = {
  realmName: string;
};

export const NewClientProfileRoute: RouteDef = {
  path: "/:realmName/realm-settings/clientPolicies/new-client-profile",
  component: NewClientProfileForm,
  breadcrumb: (t) => t("realm-settings:newClientProfile"),
  access: "view-realm",
};

export const ClientPoliciesRoute: RouteDef = {
  path: "/:realmName/realm-settings/clientPolicies",
  component: ProfilesTab,
  breadcrumb: (t) => t("realm-settings:allClientPolicies"),
  access: "view-realm",
};

export const toNewClientProfile = (
  params: clientProfileParams
): LocationDescriptorObject => ({
  pathname: generatePath(NewClientProfileRoute.path, params),
});

export const toClientProfiles = (
  params: clientProfileParams
): LocationDescriptorObject => ({
  pathname: generatePath(ClientPoliciesRoute.path, params),
});
