import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";
import { NewClientProfileForm } from "../NewClientProfileForm";

export type UpdateClientProfileParams = {
  realm: string;
  profileName: string;
};

export const UpdateClientProfileRoute: RouteDef = {
  path: "/:realm/realm-settings/clientPolicies/update-client-profile/:profileName",
  component: NewClientProfileForm,
  breadcrumb: (t) => t("realm-settings:updateClientProfile"),
  access: "view-realm",
};

export const toUpdateClientProfile = (
  params: UpdateClientProfileParams
): LocationDescriptorObject => ({
  pathname: generatePath(UpdateClientProfileRoute.path, params),
});
