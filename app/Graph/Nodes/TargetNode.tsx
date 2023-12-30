import { CSSProperties, memo, useCallback, useContext } from "react";
import { Handle, NodeProps, Position } from "reactflow";
import { MIDDLE_HANDLE_HEIGHT, NODE_WIDTH } from "../GraphNodeConstants";
import { SessionProivder } from "../../Providers";
import { ActualBlocks } from "../../Blocks/ActualBlocks";
import ViewButton from "../ViewButton";
import NodeCommon from "./NodeCommon";
import { useNodeStyle } from "@/app/utils";

function TargetNode(props: NodeProps) {
  const session = useContext(SessionProivder);
  const block = ActualBlocks[props.id];

  const baseStyle = useNodeStyle(props.id);

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
      <NodeCommon
        id={props.id}
        label={props.data?.label}
        renderEmpty={!block || !block.render()}
      />
      {block && block.render()}
    </div>
  );
}

export default memo(TargetNode);
