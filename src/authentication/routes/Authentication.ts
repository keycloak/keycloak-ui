import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";
import { AuthenticationSection } from "../AuthenticationSection";
import { CreateFlow } from "../form/CreateFlow";
import { FlowDetails } from "../FlowDetails";

export type AuthenticationParams = { realm: string };
export type FlowDetailsParams = AuthenticationParams & {
  id: string;
  usedBy: string;
  builtIn?: string;
};

export const AuthenticationRoute: RouteDef = {
  path: "/:realm/authentication",
  component: AuthenticationSection,
  breadcrumb: (t) => t("authentication"),
  access: "view-realm",
};

export const CreateFlowRoute: RouteDef = {
  path: "/:realm/authentication/create",
  component: CreateFlow,
  breadcrumb: (t) => t("authentication:createFlow"),
  access: "manage-authorization",
};

export const FlowDetailsRoute: RouteDef = {
  path: "/:realm/authentication/:id/:usedBy/:builtIn?",
  component: FlowDetails,
  breadcrumb: (t) => t("authentication:flowDetails"),
  access: "manage-authorization",
};

export const toAuthentication = (
  params: AuthenticationParams
): LocationDescriptorObject => ({
  pathname: generatePath(AuthenticationRoute.path, params),
});

export const toCreateFlow = (
  params: AuthenticationParams
): LocationDescriptorObject => ({
  pathname: generatePath(CreateFlowRoute.path, params),
});

export const toFlowDetails = (
  params: FlowDetailsParams
): LocationDescriptorObject => ({
  pathname: generatePath(FlowDetailsRoute.path, params),
});
