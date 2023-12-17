import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";
import { actualData } from "../ActualData";
import { areParamsTheSame } from "@/app/utils";

export class DataOutBlock extends BlockClass {
  type = BlockType.DATA_OUT;
  // value = tf.tensor1d([2]);

  constructor(id: string) {
    super(id, false);
  }

  forward = (inputs: Tensor[], sample?: boolean): Tensor => {
    return actualData.getCurrentSample().output;
    // if (sample) {
    //   return actualData.getCurrentSample().output;
    // } else {
    //   return this.value;
    // }
  };

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    return actualData.getCurrentSample().output.shape;
    // return inputs?.[0] ?? null;
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
    //return this.value ?? null;
    return actualData.getCurrentSample().output;
  }

  override getGrads(): Tensor | null {
    return this.grads ?? null;
  }
}
