import { useCallback, useContext, useEffect, useMemo, useState } from "react";
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
  Edge,
  useReactFlow,
  useOnSelectionChange,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
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
import { ActualBlocks, tensorflowTest3 } from "../Blocks/ActualBlocks";
import { Blocks } from "../model";
import SelectedGraph from "./SelectedGraph";

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

// tensorflowTest3();

export default function GraphDisplay() {
  const session = useContext(SessionProivder);
  const hash = useExistenceHash();

  const [redisplay, setRedisplay] = useState({});

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const labeledEdges = useMemo(() => {
    const newEdges = [...edges];
    for (const edge of newEdges) {
      const source = ActualBlocks[edge.source];
      const target = ActualBlocks[edge.target];
      if (source && target) {
        edge.label =
          source?.getValue()?.dataSync()?.toString().substring(0, 4) +
          " | " +
          target?.getGrads()?.dataSync().toString().substring(0, 4);
      }
    }
    return newEdges;
  }, [edges, session.session]);

  const onConnect = useCallback(
    (params: any) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useOnSelectionChange({
    onChange: ({ nodes, edges }) => {
      const newSelectedBlockId = nodes.length == 1 ? nodes[0].id : "";

      if (newSelectedBlockId != session.session.selectedBlockId) {
        session.setSession({
          ...session.session,
          selectedBlockId: newSelectedBlockId,
        });
      } else {
        if (!!session.session.selectedBlockId) {
          session.setSession({
            ...session.session,
            selectedBlockId: "",
          });
        }
      }

      // setSelectedNodes(nodes.map((node) => node.id));
      // setSelectedEdges(edges.map((edge) => edge.id));
    },
  });

  const onNodesDelete = useCallback(
    (deleted: any) => {
      setEdges(
        deleted.reduce((acc: any, node: any) => {
          const incomers = getIncomers(node, nodes, edges);
          const outgoers = getOutgoers(node, nodes, edges);
          const connectedEdges = getConnectedEdges([node], edges);

          const remainingEdges = acc.filter(
            (edge: any) => !connectedEdges.includes(edge)
          );

          const createdEdges = incomers.flatMap(({ id: source }) =>
            outgoers.map(({ id: target }) => ({
              id: `${source}->${target}`,
              source,
              target,
            }))
          );

          return [...remainingEdges, ...createdEdges];
        }, edges)
      );
    },
    [nodes, edges]
  );

  const reactFlowInstance = useReactFlow();

  const onNodesChangeWrapper: OnNodesChange = (changes: NodeChange[]) => {
    // console.log("node changed.");
    // console.log(stuff);

    //adjust network block positions:
    const newNetwork = { ...session.session.network };
    const newChanges: NodeChange[] = [];
    for (const node of changes) {
      let addChange = true;
      if (node.type == "remove") {
        const block = newNetwork.blocks[node.id];
        if (Blocks[block.type]?.notDeletable) {
          addChange = false;
        } else {
          delete newNetwork.blocks[node.id];
        }
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

      if (addChange) {
        newChanges.push(node);
      }
    }

    onNodesChange(newChanges);
    session.setSession({ ...session.session, network: newNetwork });
  };

  const onEdgesChangeWrapper: OnEdgesChange = (changes: EdgeChange[]) => {
    const newNetwork = { ...session.session.network };

    for (const change of changes) {
      if (change.type == "select" && change.selected) {
        //print the viewable here:

        const id = change.id;
        const edge = reactFlowInstance.getEdge(change.id);

        const source = edge?.source || "";
        const sourceHandle = edge?.sourceHandle || "";

        const block = ActualBlocks[source];

        console.log(block?.getValue()?.dataSync());
        console.log(block?.getGrads()?.dataSync());

        // const resultTensor = block.viewables[sourceHandle];
        // console.log(resultTensor.dataSync());
      }

      if (change.type == "remove") {
        const id = change.id;
        const edge = reactFlowInstance.getEdge(change.id);

        const source = edge?.source || "";
        const sourceHandle = edge?.sourceHandle || "";
        const target = edge?.target || "";
        const targetHandle = edge?.targetHandle || "";

        // const parts = id.split("|");
        // const source = "|" + parts[1] + "|";
        // const sourceHandle = "|" + parts[3] + "|";
        // const target = "|" + parts[5] + "|";
        // const targetHandle = "|" + parts[7] + "|";

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

    //convert network edges to an array of Edge
    const edges: Edge[] = [];
    for (const connectionId in session.session.network.connections) {
      const connection = session.session.network.connections[connectionId];
      edges.push({
        id: nanoid(),
        source: connection.source,
        sourceHandle: connection.sourceHandle,
        target: connection.target,
        targetHandle: connection.targetHandle,
      });
    }
    setEdges(edges);
  }, [setNodes, setEdges, hash]);

  return (
    <FlexCol
      style={{
        width: "100%",
        height: "calc(100% - 24px)",
        backgroundColor: "white",
        borderRadius: "10px",
        border: "2px solid black",
        margin: "12px",
        position: "relative",
      }}
    >
      <ReactFlow
        nodes={nodes}
        edges={labeledEdges}
        onNodesChange={onNodesChangeWrapper}
        onEdgesChange={onEdgesChangeWrapper}
        onConnect={onConnectWrapper}
        onNodesDelete={onNodesDelete}
        nodeTypes={nodeDefinitions}
      >
        <Controls />
        <MiniMap />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <SelectedGraph />
    </FlexCol>
  );
}
