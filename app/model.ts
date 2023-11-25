import { BlockClass } from "./Blocks/BlockClass";
import { ConstantBlock } from "./Blocks/ConstantBlock";
import { DataInBlock } from "./Blocks/DataInBlock";
import { DataOutBlock } from "./Blocks/DataOutBlock";
import { FinalLossBlock } from "./Blocks/FinalLossBlock";
import { InputBlock } from "./Blocks/InputBlock";
import { LinearBlock } from "./Blocks/LinearBlock";
import { MultiplyBlock } from "./Blocks/MultiplyBlock";
import { OutputBlock } from "./Blocks/OutputBlock";
import { RandomNumbersBlock } from "./Blocks/RandomNumbersBlock";
import { SquareLossBlock } from "./Blocks/SquareLossBlock";
import { VariableBlock } from "./Blocks/VariableBlock";
import { SIMPLE_TRAINING_GRAPH } from "./Samples/SimpleTrainingGraph";
import { BASIC_WORFKLOW_GRAPH } from "./Samples/BasicWorkflowGraph";

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
  nodeType: "source" | "target" | "unary" | "binary" | "sink";
  notDeletable?: boolean;
};

export enum BlockType {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
  DATA_IN = "DATA_IN",
  DATA_OUT = "DATA_OUT",
  SAMPLE_DATA = "SAMPLE_DATA",
  LINEAR = "LINEAR",
  TANH = "TANH",
  CROSS_ENTROPY = "CROSS_ENTROPY",
  RANDOM_NUMBERS = "RANDOM_NUMBERS",
  MULTIPLY = "MULTIPLY",
  VARIABLE = "VARIABLE",
  CONSTANT = "CONSTANT",
  SQUARE_LOSS = "SQUARE_LOSS",
  FINAL_LOSS = "FINAL_LOSS",
}

export const Blocks: Record<BlockType, BlockDefinition> = {
  [BlockType.INPUT]: {
    name: "Input",
    icon: "icons/data.png",
    classDef: InputBlock,
    nodeType: "unary",
    notDeletable: true,
  },
  [BlockType.OUTPUT]: {
    name: "Output",
    icon: "icons/data.png",
    classDef: OutputBlock,
    nodeType: "unary",
    notDeletable: true,
  },
  [BlockType.DATA_IN]: {
    name: "Data Input",
    icon: "icons/data.png",
    classDef: DataInBlock,
    nodeType: "source",
    notDeletable: true,
  },
  [BlockType.DATA_OUT]: {
    name: "Data Output",
    icon: "icons/data.png",
    classDef: DataOutBlock,
    nodeType: "source",
    notDeletable: true,
  },
  [BlockType.FINAL_LOSS]: {
    name: "Final Loss",
    icon: "icons/final_loss.png",
    classDef: FinalLossBlock,
    nodeType: "target",
    notDeletable: true,
  },
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
  blocksChanged?: Record<string, boolean>;
  selectedBlockId?: string;
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
  network: { ...BASIC_WORFKLOW_GRAPH } as any,
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
