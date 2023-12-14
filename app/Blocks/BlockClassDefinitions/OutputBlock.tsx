import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";

export class OutputBlock extends BlockClass {
  type = BlockType.OUTPUT;
  value = tf.tensor1d([2]);

  constructor(id: string) {
    super(id, false);
  }

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    return inputs?.[0] ?? null;
  };

  override areInputsCorrect = (
    inputs: (number[] | null)[]
  ): { correct: boolean; reason?: string } => {
    const correct = inputs.length == 1 && inputs[0] != null;
    return {
      correct,
      reason: correct
        ? undefined
        : "Input to input block must be 1 and well defined. Got length: " +
          inputs.length.toString(),
    };
  };

  forward = (inputs: Tensor[]): Tensor => {
    return inputs.length > 0 ? inputs[0] : this.value;
  };
}
