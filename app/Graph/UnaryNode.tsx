import { CSSProperties, memo, useCallback } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { MIDDLE_HANDLE_HEIGHT, NODE_WIDTH } from "./GraphNodeConstants";

function UnaryNode(props: NodeProps) {
  const baseStyle = {
    padding: 10,
    background: "#fff",
    border: "1px solid #ddd",
    width: NODE_WIDTH,
    height: "200px",
  };

  return (
    <div style={baseStyle}>
      <Handle
        type="target"
        position={Position.Left}
        id="|in0|"
        style={{
          top: "auto",
          bottom: MIDDLE_HANDLE_HEIGHT,
          background: "#555",
        }}
      />
      <Handle
        type="source"
        position={Position.Right}
        id="|out0|"
        style={{
          top: "auto",
          bottom: MIDDLE_HANDLE_HEIGHT,
          background: "#555",
        }}
      />
      {props.data?.label}
    </div>
  );
}

export default memo(UnaryNode);
