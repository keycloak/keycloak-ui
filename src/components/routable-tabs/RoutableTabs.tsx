import {
  TabProps,
  Tabs,
  TabsComponent,
  TabsProps,
} from "@patternfly/react-core";
import type { History, LocationDescriptorObject } from "history";
import React, {
  Children,
  isValidElement,
  JSXElementConstructor,
  ReactElement,
} from "react";
import { useLocation } from "react-router-dom";

type ChildElement = ReactElement<TabProps, JSXElementConstructor<TabProps>>;
type Child = ChildElement | boolean | null | undefined;

// TODO: Figure out why we need to omit 'ref' from the props.
type RoutableTabsProps = { children: Child | Child[] } & Omit<
  TabsProps,
  "ref" | "activeKey" | "component" | "children"
>;

export const RoutableTabs = ({
  children,
  ...otherProps
}: RoutableTabsProps) => {
  const { pathname } = useLocation();

  // Determine which children have an eventKey that at least partially matches the current path, then sort them so the longest match ends up on top.
  const matchedKeys = Children.toArray(children)
    .filter((child): child is ChildElement => isValidElement(child))
    .map((child) => child.props.eventKey.toString())
    .filter((eventKey) => pathname.includes(eventKey))
    .sort((a, b) => b.length - a.length);

  return (
    <Tabs
      activeKey={matchedKeys[0] ?? pathname}
      component={TabsComponent.nav}
      inset={{
        default: "insetNone",
        md: "insetSm",
        xl: "inset2xl",
        "2xl": "insetLg",
      }}
      {...otherProps}
    >
      {children}
    </Tabs>
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
