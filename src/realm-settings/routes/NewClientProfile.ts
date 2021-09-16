import type { RouteDef } from "../../route-config";
import { NewClientProfileForm } from "../NewClientProfileForm";

export const NewClientProfileRoute: RouteDef = {
  path: "/:realm/realm-settings/clientPolicies/new-client-profile",
  component: NewClientProfileForm,
  breadcrumb: (t) => t("realm-settings:newClientProfile"),
  access: "view-realm",
};
