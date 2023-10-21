import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";

export class BlockClass {
  loadFromStorage: boolean;
  id: string;

  grads: Tensor = tf.tensor1d([1]);

  constructor(id: string, loadFromStorage: boolean) {
    this.id = id;
    this.loadFromStorage = loadFromStorage;
  }

  async initialize() {}

  forward(inputs: Tensor[]): Tensor {
    return inputs[0];
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
