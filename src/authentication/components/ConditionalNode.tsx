import React, { memo } from "react";
import { Handle, Position } from "react-flow-renderer";

type ConditionalNodeProps = {
  data: { label: string };
};

export const ConditionalNode = memo(function TheNode({
  data,
}: ConditionalNodeProps) {
  return (
    <>
      <Handle position={Position.Right} type="source" />
      <div className="react-flow__node-default keycloak__authentication__conditional_node">
        <div>{data.label}</div>
      </div>
      <Handle position={Position.Left} type="target" />
    </>
  );
});
