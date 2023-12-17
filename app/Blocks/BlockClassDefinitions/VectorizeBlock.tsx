import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";
import { areParamsTheSame } from "@/app/utils";

export class VectorizeBlock extends BlockClass {
  type = BlockType.VECTORIZE;

  constructor(id: string) {
    super(id, false);
  }

  forward = (inputs: Tensor[]): Tensor => {
    const firstInput = inputs[0];

    let size = 1;

    for (const dim of firstInput.shape) {
      size *= dim;
    }

    const output = tf.reshape(firstInput, [size, 1]);

    return output;
  };

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    if (inputs.length != 1) {
      return null;
    }

    const firstInput = inputs[0];
    if (firstInput == null) {
      return null;
    }

    let size = 1;

    for (const dim of firstInput) {
      size *= dim;
    }

    return [size, 1];
  };

  override areInputsCorrect = (
    inputs: (number[] | null)[]
  ): { correct: boolean; reason?: string } => {
    if (inputs.length != 1) {
      return {
        correct: false,
        reason: "vectorize block must have exactly 1 input",
      };
    }

    return { correct: true };
  };
}
