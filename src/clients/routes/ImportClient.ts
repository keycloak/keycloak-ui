import type { LocationDescriptorObject } from "history";
import { generatePath } from "react-router-dom";
import type { RouteConfig } from "../../routes";
import { ImportForm } from "../import/ImportForm";
import type { HomeParams } from "../../routes/Home";

export type ImportClientParams = HomeParams;

export const ImportClientRoute: RouteConfig = {
  path: "/:realm/clients/import-client",
  component: ImportForm,
  breadcrumb: (t) => t("clients:importClient"),
  access: "manage-clients",
};

export const toImportClient = (
  params: ImportClientParams
): LocationDescriptorObject => ({
  pathname: generatePath(ImportClientRoute.path, params),
});
