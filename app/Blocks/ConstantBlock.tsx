import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";
import { BlockType } from "../model";

export class ConstantBlock extends BlockClass {
  type = BlockType.CONSTANT;
  value = tf.tensor([1, 2, 3, 4], [2, 2]);

  constructor(id: string) {
    super(id, false);

    this.viewables["|out0|"] = this.value.clone();
  }

  forward(inputs: Tensor[]): Tensor {
    return this.value;
  }
}
