import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";

export class MultiplyBlock extends BlockClass {
  constructor(id: string) {
    super(id, false);
  }

  forward(inputs: Tensor[]): Tensor {
    const a = inputs[0];
    const b = inputs[1];
    return tf.mul(a, b);
  }
}
