import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";
import { BlockType } from "../model";

export class ConstantBlock extends BlockClass {
  type = BlockType.CONSTANT;
  value = tf.tensor1d([2]);

  constructor(id: string) {
    super(id, false);

    this.viewables["|out0|"] = this.value.clone();
  }

  forward = (inputs: Tensor[]): Tensor => {
    return this.value;
  };

  override saveValue(value: Tensor) {
    //dont do anything
  }

  override saveGrad(grads: Tensor) {
    this.grads = grads;
  }

  //some blocks, like multiply, don't have state
  override getValue(): Tensor | null {
    return this.value ?? null;
  }

  override getGrads(): Tensor | null {
    return this.grads ?? null;
  }
}
