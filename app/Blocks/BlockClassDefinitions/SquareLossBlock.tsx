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

  override areInputsCorrect = (inputs: (number[] | null)[]): boolean => {
    if (inputs.length != 2) {
      return false;
    }

    //if any is null, return false
    if (inputs[0] == null || inputs[1] == null) {
      return false;
    }

    return areParamsTheSame(inputs[0], inputs[1]);
  };
}
