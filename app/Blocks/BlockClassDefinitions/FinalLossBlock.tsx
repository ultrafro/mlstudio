import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";

export class FinalLossBlock extends BlockClass {
  type = BlockType.FINAL_LOSS;

  constructor(id: string) {
    super(id, false);
  }

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    return inputs?.[0] ?? null;
  };

  override areInputsCorrect = (inputs: (number[] | null)[]): boolean => {
    if (inputs.length != 1) {
      return false;
    }

    return true;
  };

  forward = (inputs: Tensor[]): Tensor => {
    //just copy the first input
    const result = tf.mul(inputs[0], 1);
    // const result = inputs[0].clone();

    return result;
  };
}
