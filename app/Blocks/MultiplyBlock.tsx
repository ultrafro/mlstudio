import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";
import { BlockType } from "../model";

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
}
