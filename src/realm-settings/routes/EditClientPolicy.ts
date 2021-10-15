import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";
import { NewClientPolicyForm } from "../NewClientPolicyForm";
import { EditPolicyCrumb } from "../RealmSettingsSection";

export type EditClientPolicyParams = {
  realm: string;
  policyName: string;
  tab?: string;
};

export const EditClientPolicyRoute: RouteDef = {
  path: "/:realm/realm-settings/clientPolicies/:policyName/:tab",
  component: NewClientPolicyForm,
  access: "manage-realm",
  breadcrumb: () => EditPolicyCrumb,
};

export const toEditClientPolicy = (
  params: EditClientPolicyParams
): LocationDescriptorObject => ({
  pathname: generatePath(EditClientPolicyRoute.path, params),
});
