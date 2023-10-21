import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";

export class ConstantBlock extends BlockClass {
  value = tf.tensor([1, 2, 3, 4], [2, 2]);

  constructor(id: string) {
    super(id, false);
  }

  forward(inputs: Tensor[]): Tensor {
    return this.value;
  }
}
