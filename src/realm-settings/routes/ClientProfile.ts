import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";
import { ClientProfileForm } from "../ClientProfileForm";
import { EditProfileCrumb } from "../RealmSettingsSection";

export type ClientProfileParams = {
  realm: string;
  profileName: string;
};

export const ClientProfileRoute: RouteDef = {
  path: "/:realm/realm-settings/clientPolicies/:profileName",
  component: ClientProfileForm,
  breadcrumb: () => EditProfileCrumb,
  access: ["view-realm"],
};

export const toClientProfile = (
  params: ClientProfileParams
): LocationDescriptorObject => ({
  pathname: generatePath(ClientProfileRoute.path, params),
});
