import React from "react";
import ReactFlow, { Elements, Position } from "react-flow-renderer";

import type AuthenticationExecutionInfoRepresentation from "keycloak-admin/lib/defs/authenticationExecutionInfoRepresentation";
import type { ExecutionList, ExpandableExecution } from "../execution-model";
import { EndSubFlowNode, StartSubFlowNode } from "./diagram/SubFlowNode";
import { ConditionalNode } from "./diagram/ConditionalNode";
import { getLayoutedElements } from "./diagram/auto-layout";

import "./flow-diagram.css";

type FlowDiagramProps = {
  executionList: ExecutionList;
};

const createEdge = (fromNode: string, toNode: string) => ({
  id: `edge-${fromNode}-to-${toNode}`,
  source: fromNode,
  target: toNode,
});

const createNode = (ex: ExpandableExecution) => {
  let nodeType: string | undefined = undefined;
  if (ex.executionList) {
    nodeType = "startSubFlow";
  }
  if (ex.displayName?.startsWith("Condition")) {
    nodeType = "conditional";
  }
  return {
    id: ex.id!,
    type: nodeType,
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: ex.displayName! },
    position: { x: 0, y: 0 },
  };
};

const renderParallelNodes = (
  start: AuthenticationExecutionInfoRepresentation,
  execution: ExpandableExecution,
  end: AuthenticationExecutionInfoRepresentation
) => {
  const elements: Elements = [];
  elements.push(createNode(execution));
  elements.push(createEdge(start.id!, execution.id!));
  elements.push(createEdge(execution.id!, end.id!));
  return elements;
};

const renderSequentialNodes = (
  start: AuthenticationExecutionInfoRepresentation,
  execution: ExpandableExecution,
  end: AuthenticationExecutionInfoRepresentation,
  prefExecution: ExpandableExecution,
  isFirst: boolean,
  isLast: boolean
) => {
  const elements: Elements = [];
  elements.push(createNode(execution));
  if (isFirst) {
    elements.push(createEdge(start.id!, execution.id!));
  } else {
    elements.push(createEdge(prefExecution.id!, execution.id!));
  }

  if (isLast) {
    elements.push(createEdge(execution.id!, end.id!));
  }

  return elements;
};

const renderSubFlow = (
  execution: ExpandableExecution,
  start: AuthenticationExecutionInfoRepresentation,
  end: AuthenticationExecutionInfoRepresentation,
  prefExecution?: ExpandableExecution
) => {
  const elements: Elements = [];

  elements.push({
    id: execution.id!,
    type: "startSubFlow",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: execution.displayName! },
    position: { x: 0, y: 0 },
  });
  const endSubFlowId = `flow-end-${execution.id}`;
  elements.push({
    id: endSubFlowId,
    type: "endSubFlow",
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    data: { label: execution.displayName! },
    position: { x: 0, y: 0 },
  });
  elements.push(
    createEdge(
      prefExecution && prefExecution.requirement !== "ALTERNATIVE"
        ? prefExecution.id!
        : start.id!,
      execution.id!
    )
  );
  elements.push(createEdge(endSubFlowId, end.id!));

  return elements.concat(
    renderFlow(execution, execution.executionList, {
      ...execution,
      id: endSubFlowId,
    })
  );
};

const renderFlow = (
  start: AuthenticationExecutionInfoRepresentation,
  executionList: ExpandableExecution[],
  end: AuthenticationExecutionInfoRepresentation
) => {
  let elements: Elements = [];

  for (let index = 0; index < executionList.length; index++) {
    const execution = executionList[index];
    if (execution.executionList) {
      elements = elements.concat(
        renderSubFlow(execution, start, end, executionList[index - 1])
      );
    } else {
      if (
        execution.requirement === "ALTERNATIVE" ||
        execution.requirement === "DISABLED"
      ) {
        elements = elements.concat(renderParallelNodes(start, execution, end));
      } else {
        elements = elements.concat(
          renderSequentialNodes(
            start,
            execution,
            end,
            executionList[index - 1],
            index === 0,
            index === executionList.length - 1
          )
        );
      }
    }
  }

  return elements;
};

export const FlowDiagram = ({
  executionList: { expandableList },
}: FlowDiagramProps) => {
  let elements: Elements = [
    {
      id: "start",
      sourcePosition: Position.Right,
      type: "input",
      data: { label: "Start" },
      position: { x: 0, y: 0 },
      className: "keycloak__authentication__input_node",
    },
    {
      id: "end",
      targetPosition: Position.Left,
      type: "output",
      data: { label: "End" },
      position: { x: 0, y: 0 },
      className: "keycloak__authentication__output_node",
    },
  ];

  elements = elements.concat(
    renderFlow({ id: "start" }, expandableList, { id: "end" })
  );

  return (
    <ReactFlow
      nodeTypes={{
        conditional: ConditionalNode,
        startSubFlow: StartSubFlowNode,
        endSubFlow: EndSubFlowNode,
      }}
      elements={getLayoutedElements(elements)}
    />
  );
};
