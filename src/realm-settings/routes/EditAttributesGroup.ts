import type { LocationDescriptorObject } from "history";
import { lazy } from "react";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";

export type EditAttributesGroupParams = {
  realm: string;
  name: string;
};

export const EditAttributesGroupRoute: RouteDef = {
  path: "/:realm/realm-settings/userProfile/attributesGroup/edit/:name",
  component: lazy(() => import("../user-profile/AttributesGroupDetails")),
  access: "view-realm",
};

export const toEditAttributesGroup = (
  params: EditAttributesGroupParams
): LocationDescriptorObject => ({
  pathname: generatePath(EditAttributesGroupRoute.path, params),
});
