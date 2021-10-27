import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteDef } from "../../route-config";
import { ExecutorForm } from "../ExecutorForm";

export type ExecutorParams = {
  realm: string;
  profileName: string;
  executorName: string;
};

export const ExecutorRoute: RouteDef = {
  path: "/:realm/realm-settings/clientPolicies/:profileName/:executorName",
  component: ExecutorForm,
  breadcrumb: (t) => t("realm-settings:executorDetails"),
  access: ["manage-realm"],
};

export const toExecutor = (
  params: ExecutorParams
): LocationDescriptorObject => ({
  pathname: generatePath(ExecutorRoute.path, params),
});
