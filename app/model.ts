import { BlockClass } from "./Blocks/BlockClass";
import { LinearBlock } from "./Blocks/LinearBlock";

export type block = {
  name: string;
  icon: string;
};

export const tensorBlock: block = {
  name: "Tensor",
  icon: "icons/run.png",
};

export const blocks: block[] = [tensorBlock, tensorBlock];

export type BlockDefinition = {
  name: string;
  icon: string;
  classDef: typeof BlockClass;
  nodeType: "source" | "target" | "unary" | "binary";
};

export enum BlockType {
  DATA = "DATA",
  SAMPLE_DATA = "SAMPLE_DATA",
  LINEAR = "LINEAR",
  TANH = "TANH",
  CROSS_ENTROPY = "CROSS_ENTROPY",
}

export const Blocks: Record<BlockType, BlockDefinition> = {
  [BlockType.DATA]: {
    name: "Data",
    icon: "icons/data.png",
    classDef: BlockClass,
    nodeType: "source",
  },
  [BlockType.SAMPLE_DATA]: {
    name: "Sample Data",
    icon: "icons/sample_data.png",
    classDef: BlockClass,
    nodeType: "unary",
  },
  [BlockType.LINEAR]: {
    name: "Linear",
    icon: "icons/linear.png",
    classDef: LinearBlock,
    nodeType: "unary",
  },
  [BlockType.TANH]: {
    name: "Tanh",
    icon: "icons/tanh.png",
    classDef: BlockClass,
    nodeType: "unary",
  },
  [BlockType.CROSS_ENTROPY]: {
    name: "Cross Entropy",
    icon: "icons/cross_entropy.png",
    classDef: BlockClass,
    nodeType: "unary",
  },
};

export type SupervisedDataShape = {
  inputDimensions: number[];
  outputDimensions: number[];
  srcType: "MNIST" | "CUSTOM";
  inputType: "image" | "text" | "numbers";
  outputType: "image" | "text" | "numbers";
  trainProportion: number;
  valProportion: number;
  testProportion: number;
  fetchScript?: string;
};

export type Network = {
  blocks: Record<string, BlockRecord>;
  connections: Record<string, BlockConnection>;
};

export type BlockRecord = {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  iterations?: number;
  params?: Record<string, any>;
};

export type BlockConnection = {
  source: string;
  sourceHandle: string;
  target: string;
  targetHandle: string;
};

export type StudioSession = {
  network: Network;
  visualizers: Record<string, { blockId: string; handleId: string }>;
  supervisedDataShape: SupervisedDataShape;
};

export const DEFAULT_SESSION: StudioSession = {
  network: {
    blocks: {
      "|0|": {
        id: "|0|",
        type: BlockType.DATA,
        x: 100,
        y: 100,
      },
      "|1|": {
        id: "|1|",
        type: BlockType.LINEAR,
        x: 400,
        y: 100,
      },
    },
    connections: {},
  },
  visualizers: {},
  supervisedDataShape: {
    inputDimensions: [28, 28],
    outputDimensions: [10],
    srcType: "MNIST",
    inputType: "image",
    outputType: "numbers",
    trainProportion: 0.8,
    valProportion: 0.1,
    testProportion: 0.1,
  },
};

export type OptimizerConfig = {};
