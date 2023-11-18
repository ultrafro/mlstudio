import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import { BlockType } from "../model";

export class BlockClass {
  loadFromStorage: boolean;
  id: string;

  type: BlockType = BlockType.CONSTANT;

  internalTensor: Tensor | null = null;

  finalResultForTraining: Tensor | null = null;

  grads: Tensor = tf.tensor1d([1]);

  viewables: Record<string, Tensor> = {};

  constructor(id: string, loadFromStorage: boolean) {
    this.id = id;
    this.loadFromStorage = loadFromStorage;
  }

  async initialize() {}

  forward(inputs: Tensor[]): Tensor {
    return inputs[0];
  }

  getAdditionalOutputs(): Record<string, Tensor> {
    //return in the form of:
    // {"|out1|": tf.tensor1d([1]), "|out2|": tf.tensor1d([1])}
    return {};
  }

  saveGrad(grads: Tensor) {
    this.grads = grads;
  }

  //some blocks, like multiply, don't have state
  getValue(): Tensor | null {
    return null;
  }

  getGrads(): Tensor | null {
    return null;
  }

  destroy() {}
}
