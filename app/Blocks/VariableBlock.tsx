import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";
import { BlockType } from "../model";

export class VariableBlock extends BlockClass {
  type = BlockType.VARIABLE;

  variable = tf.variable(tf.tensor1d([Math.random()]), true, "a");

  constructor(id: string) {
    super(id, false);

    this.variable = tf.variable(tf.tensor1d([Math.random()]), true, id);
  }

  forward(inputs: Tensor[]): Tensor {
    this.viewables["|out0|"] = this.variable.clone();

    return this.variable;
  }

  getValue(): Tensor | null {
    return this.variable;
  }

  getGrads(): tf.Tensor<tf.Rank> | null {
    return this.grads;
  }
}
