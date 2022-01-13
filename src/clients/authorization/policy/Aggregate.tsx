import React from "react";

import { LogicSelector } from "./LogicSelector";
import { DecisionStrategySelect } from "../DecisionStragegySelect";
import { NameDescription } from "./NameDescription";

export const Aggregate = () => {
  return (
    <>
      <NameDescription prefix="policy" />
      <DecisionStrategySelect helpLabel="policyDecisionStagey" />
      <LogicSelector />
    </>
  );
};
