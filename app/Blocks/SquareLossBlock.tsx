import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";

export class SquareLossBlock extends BlockClass {
  constructor(id: string) {
    super(id, false);
  }

  forward(inputs: Tensor[]): Tensor {
    const x = inputs[0];
    const y = inputs[1];

    const result = y.sub(y).square().mean();
    return result;
  }
}
