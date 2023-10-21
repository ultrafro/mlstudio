import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";
export class RandomNumbersBlock extends BlockClass {
  value = tf.randomUniform([1, 2], 0, 1);

  constructor(id: string) {
    super(id, false);
  }

  forward(inputs: Tensor[]): Tensor {
    this.value = tf.randomUniform([1, 2], 0, 1);
    return this.value;
  }

  getValue(): tf.Tensor<tf.Rank> | null {
    return this.value;
  }
}
