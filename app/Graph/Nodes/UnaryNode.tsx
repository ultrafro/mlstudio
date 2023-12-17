import { CSSProperties, memo, useCallback, useContext } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { MIDDLE_HANDLE_HEIGHT, NODE_WIDTH } from "../GraphNodeConstants";
import { SessionProivder } from "../../Providers";
import { ActualBlocks } from "../../Blocks/ActualBlocks";
import ViewButton from "../ViewButton";

function UnaryNode(props: NodeProps) {
  const session = useContext(SessionProivder);
  const block = ActualBlocks[props.id];

  const baseStyle = {
    padding: 10,
    background: "#fff",
    border:
      session.session.selectedBlockId == props.id
        ? "1px solid #0dd"
        : "1px solid #ddd",
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
      <ViewButton id={props.id} />
      {block && block.render()}
    </div>
  );
}

export default memo(UnaryNode);
