import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";
export class RandomNumbersBlock extends BlockClass {
  type = BlockType.RANDOM_NUMBERS;
  value = tf.randomUniform([1, 2], 0, 1);

  constructor(id: string) {
    super(id, false);
  }

  override initialize = (): void => {
    const size = this.currentParams["shape"] as number[];
    if (!size) {
      this.value = tf.randomUniform([1, 2], 0, 1);
    } else {
      this.value = tf.randomUniform(size, 0, 1);
    }
  };

  forward = (inputs: Tensor[], sample?: boolean): Tensor => {
    if (sample) {
      const randomVal = tf.randomUniform([1, 2], 0, 1);
      return randomVal;
    } else {
      return this.value;
    }
  };

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    return this.value.shape;
  };

  override areInputsCorrect = (
    inputs: (number[] | null)[]
  ): { correct: boolean; reason?: string } => {
    return { correct: true };
  };

  getValue(): tf.Tensor<tf.Rank> | null {
    return this.value;
  }
}
