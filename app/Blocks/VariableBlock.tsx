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

  forward = (inputs: Tensor[]): Tensor => {
    return this.variable;
  };

  override saveValue(value: Tensor) {
    //dont do anything
  }

  override saveGrad(grads: Tensor) {
    this.grads = grads;
  }

  //some blocks, like multiply, don't have state
  override getValue(): Tensor | null {
    return this.variable ?? null;
  }

  override getGrads(): Tensor | null {
    return this.grads ?? null;
  }
}
