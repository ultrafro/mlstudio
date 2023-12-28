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

  override areInputsCorrect = (
    inputs: (number[] | null)[]
  ): { correct: boolean; reason?: string } => {
    if (inputs.length != 1) {
      return {
        correct: false,
        reason:
          "inputs to final loss block must be 1 and well defined. Got length: " +
          inputs.length.toString(),
      };
    }

    if (inputs[0] == null) {
      return {
        correct: false,
        reason:
          "inputs to final loss block must be well-defined, got null, likely do to something broken earlier in the chain",
      };
    }

    return { correct: true };
  };

  forward = (inputs: Tensor[]): Tensor => {
    //just copy the first input
    const result = tf.mul(inputs[0], 1);
    // const result = inputs[0].clone();
    this.value = result;

    return result;
  };
}
