import React from "react";
import type { ConfigPropertyRepresentation } from "@keycloak/keycloak-admin-client/lib/defs/authenticatorConfigInfoRepresentation";

import { COMPONENTS, isValidComponentType } from "./components";

type DynamicComponentProps = {
  properties: ConfigPropertyRepresentation[];
  labelConverter?: (label: string) => string;
};

export const DynamicComponents = ({
  properties,
  labelConverter,
}: DynamicComponentProps) => (
  <>
    {properties.map((property) => {
      const componentType = property.type!;
      if (isValidComponentType(componentType)) {
        const Component = COMPONENTS[componentType];
        return (
          <Component
            key={property.name}
            label={
              labelConverter ? labelConverter(property.label!) : property.label
            }
            {...property}
          />
        );
      } else {
        console.warn(`There is no editor registered for ${componentType}`);
      }
    })}
  </>
);
