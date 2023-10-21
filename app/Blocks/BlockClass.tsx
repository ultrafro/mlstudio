import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";

export class BlockClass {
  loadFromStorage: boolean;
  id: string;

  grads: Tensor = tf.tensor1d([1]);

  value: Tensor = tf.tensor1d([1]);

  constructor(id: string, loadFromStorage: boolean) {
    this.id = id;
    this.loadFromStorage = loadFromStorage;
  }

  async initialize() {}

  forward(inputs: Tensor[]) {}

  saveStepResults(value: Tensor, grads: Tensor) {
    this.value = value;
    this.grads = grads;
  }

  destroy() {}
}
