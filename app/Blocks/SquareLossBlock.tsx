import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";
import { BlockType } from "../model";

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
}
