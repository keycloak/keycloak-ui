import React from "react";

import { LogicSelector } from "./LogicSelector";
import { DecisionStrategySelect } from "../DecisionStragegySelect";
import { NameDescription } from "./NameDescription";

// type AggregateProps = {
//   id: string;
// };
//{ id }: AggregateProps) => {

export const Aggregate = () => {
  return (
    <>
      <NameDescription prefix="policy" />
      <DecisionStrategySelect helpLabel="policyDecisionStagey" />
      <LogicSelector />
    </>
  );
};
