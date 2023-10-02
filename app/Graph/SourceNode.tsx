import { CSSProperties, memo, useCallback } from "react";
import { Handle, NodeProps, Position } from "reactflow";

function SourceNode(props: NodeProps) {
  const baseStyle = {
    padding: 10,
    background: "#fff",
    border: "1px solid #ddd",
    width: "100px",
    height: "200px",
  };

  return (
    <div style={baseStyle}>
      <Handle type="source" position={Position.Right} id="|out0|" />
      {props.data?.label}
    </div>
  );
}

export default memo(SourceNode);
