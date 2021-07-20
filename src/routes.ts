import type { TFunction } from "i18next";
import type { AccessType } from "keycloak-admin/lib/defs/whoAmIRepresentation";
import type { ComponentType } from "react";

import clientRoutes from "./clients/routes";

export type RouteConfig = {
  path: string;
  component: ComponentType;
  breadcrumb: ((t: TFunction) => string) | null;
  access: AccessType;
  exact?: boolean;
};

const routes: RouteConfig[] = [...clientRoutes];

export default routes;
