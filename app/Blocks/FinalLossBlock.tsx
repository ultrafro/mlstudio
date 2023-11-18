import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "./BlockClass";
import { BlockType } from "../model";

export class FinalLossBlock extends BlockClass {
  type = BlockType.FINAL_LOSS;

  constructor(id: string) {
    super(id, false);
  }

  forward(inputs: Tensor[]): Tensor {
    const result = inputs[0];

    this.finalResultForTraining = result;

    this.viewables["|in0|"] = result.clone();

    return result;
  }
}
