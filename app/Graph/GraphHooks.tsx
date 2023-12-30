import { useContext } from "react";
import { SessionProivder } from "../Providers";
import { Blocks, Network } from "../model";
import ReactFlow, {
  useEdgesState,
  useNodesState,
  addEdge,
  Controls,
  MiniMap,
  Background,
  BackgroundVariant,
  OnNodesChange,
  Node,
  Position,
} from "reactflow";

export function useExistenceHash() {
  const session = useContext(SessionProivder);

  return Object.values(session.session.network.blocks)
    .map((block) => {
      return block.id;
    })
    .join("");
}

export function getNodesFromNetwork(network: Network): Node<
  {
    label: string;
  },
  string | undefined
>[] {
  const result: Node<
    {
      label: string;
    },
    string | undefined
  >[] = [];

  for (const block of Object.values(network.blocks)) {
    const definition = Blocks[block.type];

    result.push({
      id: block.id,
      position: { x: block.x, y: block.y },
      data: { label: definition.name },
      sourcePosition: Position.Right,
      targetPosition: Position.Left,
      type: definition.nodeType,
    });
  }

  return result;
}

export function getConnectionId({
  source,
  target,
  sourceHandle,
  targetHandle,
}: {
  source: string;
  target: string;
  sourceHandle: string | null;
  targetHandle: string | null;
}) {
  return source + "_" + sourceHandle + "_" + target + "_" + targetHandle;
}
