import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";
import { actualData } from "../ActualData";
import { areParamsTheSame } from "@/app/utils";

export class DataOutBlock extends BlockClass {
  type = BlockType.DATA_OUT;
  value = tf.tensor1d([2]);

  constructor(id: string) {
    super(id, false);
  }

  forward = (inputs: Tensor[], sample?: boolean): Tensor => {
    if (sample) {
      return actualData.getCurrentSample().output;
    } else {
      return this.value;
    }
  };

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    return inputs?.[0] ?? null;
  };

  override areInputsCorrect = (
    inputs: (number[] | null)[]
  ): { correct: boolean; reason?: string } => {
    if (inputs.length != 1) {
      return {
        correct: false,
        reason:
          "input to data out block must be 1, got: " +
          inputs.length.toString() +
          " inputs",
      };
    }

    if (inputs[0] == null) {
      return {
        correct: false,
        reason: "input to data-out block must be well-defined, got null",
      };
    }

    const paramsTheSame = areParamsTheSame(inputs[0], this.value.shape);
    return {
      correct: paramsTheSame,
      reason: paramsTheSame
        ? undefined
        : "input to data-out block must be the same shape as the output of the model. Expected: " +
          this.value.shape.toString() +
          ", got: " +
          inputs[0].toString() +
          " and got: " +
          inputs[0].toString(),
    };
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
