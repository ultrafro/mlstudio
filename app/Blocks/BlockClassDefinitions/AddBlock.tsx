import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";
import { areParamsTheSame } from "@/app/utils";

export class AddBlock extends BlockClass {
  type = BlockType.ADD;

  constructor(id: string) {
    super(id, false);
  }

  forward = (inputs: Tensor[]): Tensor => {
    const a = inputs[0];
    const b = inputs[1];
    const output = tf.add(a, b);

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

    return inputs[0];
  };

  override areInputsCorrect = (
    inputs: (number[] | null)[]
  ): { correct: boolean; reason?: string } => {
    if (inputs.length != 2) {
      return { correct: false, reason: "Add block must have 2 inputs" };
    }

    //if any is null, return false
    if (inputs[0] == null || inputs[1] == null) {
      return {
        correct: false,
        reason: "Add block must have 2 defined inputs",
      };
    }

    //if they are different sizes, return false
    if (!areParamsTheSame(inputs[0], inputs[1])) {
      return {
        correct: false,
        reason:
          "add block inputs must have matching dimensions. got: " +
          inputs[0].toString() +
          " and " +
          inputs[1].toString(),
      };
    }

    return { correct: true };
  };
}
