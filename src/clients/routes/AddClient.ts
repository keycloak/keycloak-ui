import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from "../../routes";
import type { HomeParams } from "../../routes/Home";
import { NewClientForm } from "../add/NewClientForm";

export type AddClientParams = HomeParams;

export const AddClientRoute: RouteConfig = {
  path: "/:realm/clients/add-client",
  component: NewClientForm,
  breadcrumb: (t) => t("clients:createClient"),
  access: "manage-clients",
};

export const toAddClient = (
  params: AddClientParams
): LocationDescriptorObject => ({
  pathname: generatePath(AddClientRoute.path, params),
});
