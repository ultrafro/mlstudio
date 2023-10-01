import { useCallback, useContext, useEffect } from "react";
import { FlexCol, FlexRow } from "../Flex";
import ReactFlow, {
  useEdgesState,
  useNodesState,
  addEdge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  OnNodesChange,
} from "reactflow";

import "reactflow/dist/style.css";
import { SessionProivder } from "../Providers";
import { getNodesFromNetwork, useExistenceHash } from "./GraphHooks";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

export default function GraphDisplay() {
  const session = useContext(SessionProivder);
  const hash = useExistenceHash();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodesChangeWrapper: OnNodesChange = (stuff: any) => {
    // console.log("node changed.");
    // console.log(stuff);

    //adjust network block positions:
    const newNetwork = { ...session.session.network };
    for (const node of stuff) {
      const block = newNetwork.blocks[node.id];
      if (node.positionAbsolute) {
        block.x = node.positionAbsolute.x;
        block.y = node.positionAbsolute.y;
      }
    }

    onNodesChange(stuff);
    session.setSession({ ...session.session, network: newNetwork });
  };

  useEffect(() => {
    const h = hash;
    const nodes = getNodesFromNetwork(session.session.network);
    setNodes(nodes);
  }, [setNodes, hash]);

  return (
    <FlexCol
      style={{
        width: "100%",
        height: "calc(100% - 24px)",
        backgroundColor: "white",
        borderRadius: "10px",
        border: "2px solid black",
        margin: "12px",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeWrapper}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </FlexCol>
  );
}
