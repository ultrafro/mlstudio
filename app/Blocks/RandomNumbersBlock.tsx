import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";
import { BlockType } from "../model";
export class RandomNumbersBlock extends BlockClass {
  type = BlockType.RANDOM_NUMBERS;
  value = tf.randomUniform([1, 2], 0, 1);

  constructor(id: string) {
    super(id, false);
  }

  forward = (inputs: Tensor[]): Tensor => {
    const randomVal = tf.randomUniform([1, 2], 0, 1);
    return randomVal;
  };

  getValue(): tf.Tensor<tf.Rank> | null {
    return this.value;
  }
}
