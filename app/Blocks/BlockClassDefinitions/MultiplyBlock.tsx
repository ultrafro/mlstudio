import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";

export class MultiplyBlock extends BlockClass {
  type = BlockType.MULTIPLY;

  constructor(id: string) {
    super(id, false);
  }

  forward = (inputs: Tensor[]): Tensor => {
    const a = inputs[0];
    const b = inputs[1];
    const output = tf.mul(a, b);

    return output;
  };

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    if (inputs.length != 2) {
      return null;
    }

    //if any is null, return false
    if (inputs[0] == null || inputs[1] == null) {
      return null;
    }

    //[2x4x5] x [5x3x2] = [2x4x3x2]

    const outputShape = inputs[0].slice(0, inputs[0].length - 1);
    outputShape.push(...inputs[1].slice(1, inputs[1].length));
    return outputShape;
  };

  override areInputsCorrect = (inputs: (number[] | null)[]): boolean => {
    if (inputs.length != 2) {
      return false;
    }

    //if any is null, return false
    if (inputs[0] == null || inputs[1] == null) {
      return false;
    }

    if (inputs[0][inputs[0].length - 1] != inputs[1][0]) {
      return false;
    }

    return true;
  };
}
