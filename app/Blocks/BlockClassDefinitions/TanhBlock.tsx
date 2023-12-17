import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";
import { areParamsTheSame } from "@/app/utils";

export class TanhBlock extends BlockClass {
  type = BlockType.TANH;

  constructor(id: string) {
    super(id, false);
  }

  forward = (inputs: Tensor[]): Tensor => {
    const output = tf.tanh(inputs[0]);

    return output;
  };

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    if (inputs.length != 1) {
      return null;
    }

    return inputs[0];
  };

  override areInputsCorrect = (
    inputs: (number[] | null)[]
  ): { correct: boolean; reason?: string } => {
    if (inputs.length != 1) {
      return { correct: false, reason: "tanh block must have exactly 1 input" };
    }

    return { correct: true };
  };
}
