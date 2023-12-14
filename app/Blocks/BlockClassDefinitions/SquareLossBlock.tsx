import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";
import { areParamsTheSame } from "@/app/utils";

export class SquareLossBlock extends BlockClass {
  type = BlockType.SQUARE_LOSS;

  internalTensor: tf.Tensor<Rank> = tf.scalar(0);

  constructor(id: string) {
    super(id, false);
  }

  forward = (inputs: Tensor[]): Tensor => {
    const x = inputs[0];
    const y = inputs[1];

    const result = y.sub(x).square().mean();

    return result;
  };

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    return [1];
  };

  override areInputsCorrect = (
    inputs: (number[] | null)[]
  ): { correct: boolean; reason?: string } => {
    if (inputs.length != 2) {
      return {
        correct: false,
        reason:
          "inputs to square loss block must be 2, got: " +
          inputs.length.toString(),
      };
    }

    //if any is null, return false
    if (inputs[0] == null || inputs[1] == null) {
      return {
        correct: false,
        reason: "inputs to square loss block must be well-defined, got null",
      };
    }

    const paramsTheSame = areParamsTheSame(inputs[0], inputs[1]);
    return {
      correct: paramsTheSame,
      reason: paramsTheSame
        ? undefined
        : "inputs to square loss block must be the same shape. Got: " +
          inputs[0].toString() +
          " and got: " +
          inputs[1].toString(),
    };
  };
}
