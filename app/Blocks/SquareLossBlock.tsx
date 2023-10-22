import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";
import { BlockType } from "../model";

export class SquareLossBlock extends BlockClass {
  type = BlockType.SQUARE_LOSS;

  constructor(id: string) {
    super(id, false);
  }

  forward(inputs: Tensor[]): Tensor {
    const x = inputs[0];
    const y = inputs[1];

    const result = y.sub(y).square().mean();

    this.viewables["|in0|"] = x.clone();
    this.viewables["|in1|"] = y.clone();
    this.viewables["|out0|"] = result.clone();

    return result;
  }
}
