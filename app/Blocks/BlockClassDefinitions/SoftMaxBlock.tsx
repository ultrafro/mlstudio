import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";
import { areParamsTheSame, squeezeDims } from "@/app/utils";

export class SoftMaxBlock extends BlockClass {
  type = BlockType.SQUARE_LOSS;

  internalTensor: tf.Tensor<Rank> = tf.scalar(0);

  constructor(id: string) {
    super(id, false);
  }

  forward = (inputs: Tensor[]): Tensor => {
    const firstInput = inputs[0];

    let size = 1;

    for (const dim of firstInput.shape) {
      size *= dim;
    }

    const output = tf.reshape(firstInput, [size]);

    const result = tf.softmax(output);

    return result;
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
        reason:
          "inputs to softmax block must be 1, got: " + inputs.length.toString(),
      };
    }

    //if any is null, return false
    if (inputs[0] == null) {
      return {
        correct: false,
        reason: "inputs to softmax block must be well-defined, got null",
      };
    }

    const squeezedFirstInput = squeezeDims(inputs[0]);

    return {
      correct: true,
    };
  };
}
