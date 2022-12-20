import { lazy } from "react";
import type { Path } from "react-router-dom-v5-compat";
import { generatePath } from "react-router-dom-v5-compat";
import type { RouteDef } from "../../route-config";

export type EventsSubTab =
  | "event-listeners"
  | "user-events-settings"
  | "admin-events-settings";

export type EventsParams = {
  realm: string;
  tab: EventsSubTab;
};

export const EventsRoute: RouteDef = {
  path: "/:realm/realm-settings/events/:tab",
  component: lazy(() => import("../RealmSettingsSection")),
  breadcrumb: (t) => t("realm-settings:events"),
  access: "view-realm",
};

export const toEventsTab = (params: EventsParams): Partial<Path> => ({
  pathname: generatePath(EventsRoute.path, params),
});
