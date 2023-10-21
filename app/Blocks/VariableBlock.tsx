import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";

export class VariableBlock extends BlockClass {
  variable = tf.variable(tf.tensor1d([1]), true, "a");

  constructor(id: string) {
    super(id, false);
  }

  forward(inputs: Tensor[]): Tensor {
    return this.variable;
  }

  getValue(): Tensor | null {
    return this.variable;
  }

  getGrads(): tf.Tensor<tf.Rank> | null {
    return this.grads;
  }
}
