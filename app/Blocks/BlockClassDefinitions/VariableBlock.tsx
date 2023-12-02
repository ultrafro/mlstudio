import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";

export class VariableBlock extends BlockClass {
  type = BlockType.VARIABLE;

  variable = tf.variable(tf.tensor1d([Math.random()]), true, "a");

  constructor(id: string) {
    super(id, false);

    this.variable = tf.variable(tf.tensor1d([Math.random()]), true, id);
  }

  override initialize = (): void => {
    const size = this.currentParams["shape"] as number[];
    if (!size) {
      this.variable = tf.variable(tf.tensor1d([Math.random()]), true, this.id);
    } else {
      this.variable = tf.variable(tf.randomNormal(size as any), true, this.id);
    }
  };

  forward = (inputs: Tensor[]): Tensor => {
    return this.variable;
  };

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    return this.value?.shape ?? null;
  };

  override areInputsCorrect = (inputs: (number[] | null)[]): boolean => {
    return true;
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
