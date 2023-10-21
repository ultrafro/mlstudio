import { BlockClass } from "./Blocks/BlockClass";
import { ConstantBlock } from "./Blocks/ConstantBlock";
import { LinearBlock } from "./Blocks/LinearBlock";
import { MultiplyBlock } from "./Blocks/MultiplyBlock";
import { RandomNumbersBlock } from "./Blocks/RandomNumbersBlock";
import { SquareLossBlock } from "./Blocks/SquareLossBlock";
import { VariableBlock } from "./Blocks/VariableBlock";

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
  RANDOM_NUMBERS = "RANDOM_NUMBERS",
  MULTIPLY = "MULTIPLY",
  VARIABLE = "VARIABLE",
  CONSTANT = "CONSTANT",
  SQUARE_LOSS = "SQUARE_LOSS",
}

export const Blocks: Record<BlockType, BlockDefinition> = {
  [BlockType.RANDOM_NUMBERS]: {
    name: "Random Numbers",
    icon: "icons/data.png",
    classDef: RandomNumbersBlock,
    nodeType: "source",
  },
  [BlockType.MULTIPLY]: {
    name: "Multiply",
    icon: "icons/data.png",
    classDef: MultiplyBlock,
    nodeType: "binary",
  },
  [BlockType.VARIABLE]: {
    name: "Variable",
    icon: "icons/data.png",
    classDef: VariableBlock,
    nodeType: "source",
  },
  [BlockType.CONSTANT]: {
    name: "Constant",
    icon: "icons/data.png",
    classDef: ConstantBlock,
    nodeType: "source",
  },
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
  [BlockType.SQUARE_LOSS]: {
    name: "square Loss",
    icon: "icons/square_loss.png",
    classDef: SquareLossBlock,
    nodeType: "binary",
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
  // network: {
  //   blocks: {
  //     "|0|": {
  //       id: "|0|",
  //       type: BlockType.DATA,
  //       x: 100,
  //       y: 100,
  //     },
  //     "|1|": {
  //       id: "|1|",
  //       type: BlockType.LINEAR,
  //       x: 400,
  //       y: 100,
  //     },
  //   },
  //   connections: {},
  // },
  network: {
    blocks: {
      "|0|": {
        id: "|0|",
        type: BlockType.RANDOM_NUMBERS,
        x: 100,
        y: 200,
      },
      "|2|": {
        id: "|2|",
        type: BlockType.VARIABLE,
        x: 100,
        y: 400,
      },
      "|4|": {
        id: "|4|",
        type: BlockType.CONSTANT,
        x: 100,
        y: 0,
      },
      "|3|": {
        id: "|3|",
        type: BlockType.MULTIPLY,
        x: 400,
        y: 200,
      },

      "|5|": {
        id: "|5|",
        type: BlockType.SQUARE_LOSS,
        x: 800,
        y: 200,
      },
      "|6|": {
        id: "|6|",
        type: BlockType.MULTIPLY,
        x: 400,
        y: 400,
      },
    },
    connections: {
      "|4|_|out0|_|3|_|in1|": {
        source: "|4|",
        sourceHandle: "|out0|",
        target: "|3|",
        targetHandle: "|in1|",
      },
      "|0|_|out0|_|3|_|in0|": {
        source: "|0|",
        sourceHandle: "|out0|",
        target: "|3|",
        targetHandle: "|in0|",
      },
      "|0|_|out0|_|6|_|in1|": {
        source: "|0|",
        sourceHandle: "|out0|",
        target: "|6|",
        targetHandle: "|in1|",
      },
      "|2|_|out0|_|6|_|in0|": {
        source: "|2|",
        sourceHandle: "|out0|",
        target: "|6|",
        targetHandle: "|in0|",
      },
      "|3|_|out0|_|5|_|in1|": {
        source: "|3|",
        sourceHandle: "|out0|",
        target: "|5|",
        targetHandle: "|in1|",
      },
      "|6|_|out0|_|5|_|in0|": {
        source: "|6|",
        sourceHandle: "|out0|",
        target: "|5|",
        targetHandle: "|in0|",
      },
    },
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
