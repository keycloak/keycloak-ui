import React from "react";
import { Card, CardBody } from "@patternfly/react-core";

import "./flow-title.css";

type FlowTitleProps = {
  title: string;
};

export const FlowTitle = ({ title }: FlowTitleProps) => (
  <Card data-testid={title} className="keycloak__authentication__title" isFlat>
    <CardBody>{title}</CardBody>
  </Card>
);
