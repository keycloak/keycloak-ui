import { Tabs, TabsComponent, TabsProps } from "@patternfly/react-core";
import type { History, LocationDescriptorObject } from "history";
import React from "react";
import { useLocation } from "react-router-dom";

// TODO: Figure out why we need to omit 'ref' from the props.
type RoutableTabsProps = Omit<TabsProps, "ref" | "activeKey" | "component">;

export const RoutableTabs = ({ ...otherProps }: RoutableTabsProps) => {
  const location = useLocation();
  const activeKey = location.pathname;

  return (
    <Tabs
      activeKey={activeKey}
      component={TabsComponent.nav}
      inset={{
        default: "insetNone",
        md: "insetSm",
        xl: "inset2xl",
        "2xl": "insetLg",
      }}
      {...otherProps}
    />
  );
};

type RoutableTabParams = {
  to: LocationDescriptorObject;
  history: History<unknown>;
};

export const routableTab = ({ to, history }: RoutableTabParams) => ({
  eventKey: to.pathname ?? "",
  href: history.createHref(to),
});
