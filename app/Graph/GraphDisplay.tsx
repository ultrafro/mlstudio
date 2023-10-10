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
  OnEdgesChange,
  EdgeChange,
  NodeChange,
  OnConnect,
  Connection,
} from "reactflow";

import "reactflow/dist/style.css";
import { SessionProivder } from "../Providers";
import {
  getConnectionId,
  getNodesFromNetwork,
  useExistenceHash,
} from "./GraphHooks";
import "./reactFlowOverrides.css";
import { nanoid } from "nanoid";
import SourceNode from "./SourceNode";
import TargetNode from "./TargetNode";
import UnaryNode from "./UnaryNode";
import BinaryNode from "./BinaryNode";
import {
  tensorflowTest,
  tensorflowTest2,
  tensorflowTest3,
} from "../Blocks/ActualBlocks";

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } },
];
const initialEdges = [{ id: "e1-2", source: "1", target: "2" }];

const nodeDefinitions = {
  source: SourceNode,
  target: TargetNode,
  unary: UnaryNode,
  binary: BinaryNode,
};

tensorflowTest3();

export default function GraphDisplay() {
  const session = useContext(SessionProivder);
  const hash = useExistenceHash();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  const onNodesChangeWrapper: OnNodesChange = (changes: NodeChange[]) => {
    // console.log("node changed.");
    // console.log(stuff);

    //adjust network block positions:
    const newNetwork = { ...session.session.network };
    for (const node of changes) {
      if (node.type == "remove") {
      }

      if (node.type == "add") {
      }

      if (node.type == "position") {
        const block = newNetwork.blocks[node.id];
        if (node.positionAbsolute) {
          block.x = node.positionAbsolute.x;
          block.y = node.positionAbsolute.y;
        }
      }
    }

    onNodesChange(changes);
    session.setSession({ ...session.session, network: newNetwork });
  };

  const onEdgesChangeWrapper: OnEdgesChange = (changes: EdgeChange[]) => {
    const newNetwork = { ...session.session.network };

    for (const change of changes) {
      if (change.type == "remove") {
        const id = change.id;

        const parts = id.split("|");
        const source = "|" + parts[1] + "|";
        const sourceHandle = "|" + parts[3] + "|";
        const target = "|" + parts[5] + "|";
        const targetHandle = "|" + parts[7] + "|";

        const connectionId = getConnectionId({
          source,
          sourceHandle,
          target,
          targetHandle,
        });
        delete newNetwork.connections[connectionId];
      }
    }

    onEdgesChange(changes);
    session.setSession({ ...session.session, network: newNetwork });
  };

  const onConnectWrapper: OnConnect = (connection: Connection) => {
    const newNetwork = { ...session.session.network };

    if (connection.source && connection.target) {
      const connectionId = getConnectionId({
        source: connection.source,
        sourceHandle: connection.sourceHandle,
        target: connection.target,
        targetHandle: connection.targetHandle,
      });
      newNetwork.connections[connectionId] = {
        source: connection.source,
        sourceHandle: connection.sourceHandle || "",
        target: connection.target,
        targetHandle: connection.targetHandle || "",
      };
    }

    onConnect(connection);

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
        onEdgesChange={onEdgesChangeWrapper}
        onConnect={onConnectWrapper}
        nodeTypes={nodeDefinitions}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </FlexCol>
  );
}
