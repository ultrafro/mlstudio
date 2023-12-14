import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";
import { actualData } from "../ActualData";

export class DataInBlock extends BlockClass {
  type = BlockType.DATA_IN;

  //set value to random tensor of dimension 3
  value = tf.randomNormal([28, 28, 4]) as Tensor<Rank.R3>;

  constructor(id: string) {
    super(id, false);
  }

  forward = (inputs: Tensor[], sample?: boolean): Tensor => {
    if (sample) {
      return actualData.getCurrentSample().input;
    } else {
      return this.value;
    }
  };

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    return this.value.shape;
  };

  override areInputsCorrect = (
    inputs: (number[] | null)[]
  ): { correct: boolean; reason?: string } => {
    return { correct: true };
  };

  override saveValue(value: Tensor) {
    //dont do anything
  }

  override saveGrad(grads: Tensor) {
    this.grads = grads;
  }

  //some blocks, like multiply, don't have state
  override getValue(): Tensor | null {
    return this.value ?? null;
  }

  override getGrads(): Tensor | null {
    return this.grads ?? null;
  }
}
