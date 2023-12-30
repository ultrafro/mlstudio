import { BlockClass } from "./Blocks/BlockClass";
import { ConstantBlock } from "./Blocks/BlockClassDefinitions/ConstantBlock";
import { DataInBlock } from "./Blocks/BlockClassDefinitions/DataInBlock";
import { DataOutBlock } from "./Blocks/BlockClassDefinitions/DataOutBlock";
import { FinalLossBlock } from "./Blocks/BlockClassDefinitions/FinalLossBlock";
import { InputBlock } from "./Blocks/BlockClassDefinitions/InputBlock";
import { LinearBlock } from "./Blocks/BlockClassDefinitions/LinearBlock";
import { MultiplyBlock } from "./Blocks/BlockClassDefinitions/MultiplyBlock";
import { OutputBlock } from "./Blocks/BlockClassDefinitions/OutputBlock";
import { RandomNumbersBlock } from "./Blocks/BlockClassDefinitions/RandomNumbersBlock";
import { SquareLossBlock } from "./Blocks/BlockClassDefinitions/SquareLossBlock";
import { VariableBlock } from "./Blocks/BlockClassDefinitions/VariableBlock";
import { SIMPLE_TRAINING_GRAPH } from "./Samples/SimpleTrainingGraph";
import { BASIC_WORFKLOW_GRAPH } from "./Samples/BasicWorkflowGraph";
import { AddBlock } from "./Blocks/BlockClassDefinitions/AddBlock";
import { TanhBlock } from "./Blocks/BlockClassDefinitions/TanhBlock";
import { VectorizeBlock } from "./Blocks/BlockClassDefinitions/VectorizeBlock";
import * as tf from "@tensorflow/tfjs";
import { SIMPLE_MULTIPLY_LEARNING_GRAPH } from "./Samples/SimpleMultiplyLearningGraph";
import { SoftMaxBlock } from "./Blocks/BlockClassDefinitions/SoftMaxBlock";
import { basicLinearGraph } from "./Samples/basicLinearGraph";

export type block = {
  name: string;
  icon: string;
};

export const tensorBlock: block = {
  name: "Tensor",
  icon: "/icons/run.png",
};

export const blocks: block[] = [tensorBlock, tensorBlock];

export type BlockDefinition = {
  name: string;
  icon: string;
  classDef: typeof BlockClass;
  nodeType: "source" | "target" | "unary" | "binary" | "sink";
  notDeletable?: boolean;
  hasWeights: boolean;
};

export enum BlockType {
  INPUT = "INPUT",
  OUTPUT = "OUTPUT",
  DATA_IN = "DATA_IN",
  DATA_OUT = "DATA_OUT",
  LINEAR = "LINEAR",
  TANH = "TANH",
  RANDOM_NUMBERS = "RANDOM_NUMBERS",
  MULTIPLY = "MULTIPLY",
  ADD = "ADD",
  VARIABLE = "VARIABLE",
  CONSTANT = "CONSTANT",
  SQUARE_LOSS = "SQUARE_LOSS",
  SOFTMAX = "SOFTMAX",
  FINAL_LOSS = "FINAL_LOSS",
  VECTORIZE = "VECTORIZE",
}

export const Blocks: Record<BlockType, BlockDefinition> = {
  [BlockType.INPUT]: {
    name: "Input",
    icon: "/icons/input.png",
    classDef: InputBlock,
    nodeType: "unary",
    notDeletable: true,
    hasWeights: false,
  },
  [BlockType.OUTPUT]: {
    name: "Output",
    icon: "/icons/output.png",
    classDef: OutputBlock,
    nodeType: "unary",
    notDeletable: true,
    hasWeights: false,
  },
  [BlockType.DATA_IN]: {
    name: "Data Input",
    icon: "/icons/input.png",
    classDef: DataInBlock,
    nodeType: "source",
    notDeletable: true,
    hasWeights: false,
  },
  [BlockType.DATA_OUT]: {
    name: "Data Output",
    icon: "/icons/output.png",
    classDef: DataOutBlock,
    nodeType: "source",
    notDeletable: true,
    hasWeights: false,
  },
  [BlockType.FINAL_LOSS]: {
    name: "Final Loss",
    icon: "/icons/finalLoss.png",
    classDef: FinalLossBlock,
    nodeType: "target",
    notDeletable: true,
    hasWeights: false,
  },
  [BlockType.RANDOM_NUMBERS]: {
    name: "Random Numbers",
    icon: "/icons/random.png",
    classDef: RandomNumbersBlock,
    nodeType: "source",
    hasWeights: false,
  },
  [BlockType.MULTIPLY]: {
    name: "Multiply",
    icon: "/icons/multiply.png",
    classDef: MultiplyBlock,
    nodeType: "binary",
    hasWeights: false,
  },
  [BlockType.ADD]: {
    name: "Add",
    icon: "/icons/add.png",
    classDef: AddBlock,
    nodeType: "binary",
    hasWeights: false,
  },
  [BlockType.VARIABLE]: {
    name: "Variable",
    icon: "/icons/variable.png",
    classDef: VariableBlock,
    nodeType: "source",
    hasWeights: true,
  },
  [BlockType.CONSTANT]: {
    name: "Constant",
    icon: "/icons/constant.png",
    classDef: ConstantBlock,
    nodeType: "source",
    hasWeights: false,
  },
  [BlockType.LINEAR]: {
    name: "Neuron Layer",
    icon: "/icons/neuronIcon.png",
    classDef: LinearBlock,
    nodeType: "unary",
    hasWeights: true,
  },
  [BlockType.TANH]: {
    name: "Tanh",
    icon: "/icons/tanh.png",
    classDef: TanhBlock,
    nodeType: "unary",
    hasWeights: false,
  },
  [BlockType.SQUARE_LOSS]: {
    name: "square Loss",
    icon: "/icons/square.png",
    classDef: SquareLossBlock,
    nodeType: "binary",
    hasWeights: false,
  },
  [BlockType.SOFTMAX]: {
    name: "softmax",
    icon: "/icons/crossEntropy.png",
    classDef: SoftMaxBlock,
    nodeType: "unary",
    hasWeights: false,
  },
  [BlockType.VECTORIZE]: {
    name: "Vectorize",
    icon: "/icons/flatten.png",
    classDef: VectorizeBlock,
    nodeType: "unary",
    hasWeights: false,
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
  customFunction?: (input: tf.Tensor) => tf.Tensor;
  fetchScript?: string;
};

export type Network = {
  blocks: Record<string, BlockRecord>;
  connections: Record<string, BlockConnection>;
};

export type BlockParams = Record<string, string | number | number[]>;

export type BlockRecord = {
  id: string;
  type: BlockType;
  x: number;
  y: number;
  iterations?: number;
  params?: BlockParams;
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
  trainingSettings: TrainingSettings;
  initialized: boolean;
};

export type TrainingSettings = {
  learningRate: number;
  optimizer: "sgd" | "adagrad" | "adam";
};

export const DEFAULT_SESSION: StudioSession = {
  initialized: false,
  // network: { ...BASIC_WORFKLOW_GRAPH } as any,
  network: { ...basicLinearGraph } as any,

  visualizers: {},
  trainingSettings: {
    learningRate: 0.1,
    optimizer: "sgd",
  },
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
  //network: { ...SIMPLE_MULTIPLY_LEARNING_GRAPH } as any,
  // supervisedDataShape: {
  //   inputDimensions: [1],
  //   outputDimensions: [1],
  //   srcType: "CUSTOM",
  //   inputType: "numbers",
  //   outputType: "numbers",
  //   trainProportion: 0.8,
  //   valProportion: 0.1,
  //   testProportion: 0.1,
  //   customFunction: (input: tf.Tensor) => {
  //     const output = tf.mul(input, tf.scalar(2));
  //     return output;
  //   },
  // },
};

export type OptimizerConfig = {};
