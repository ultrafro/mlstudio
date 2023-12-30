import * as tf from "@tensorflow/tfjs";
import { Tensor } from "@tensorflow/tfjs";
import { BlockParams, BlockType } from "../model";
import BlockEditor from "./BlockEditor";
import { areParamsTheSame } from "../utils";
import { ReactElement } from "react";

export class BlockClass {
  loadFromStorage: boolean;
  id: string;

  type: BlockType = BlockType.CONSTANT;

  internalTensor: Tensor | null = null;

  value?: Tensor;

  grads?: Tensor;

  weightGrads?: Tensor[];

  viewables: Record<string, Tensor> = {};

  currentParams: BlockParams = {};

  constructor(id: string, loadFromStorage: boolean) {
    this.id = id;
    this.loadFromStorage = loadFromStorage;
  }

  initialize(params?: BlockParams) {}

  getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    return null;
  };

  areInputsCorrect = (
    inputs: (number[] | null)[]
  ): { correct: boolean; reason?: string } => {
    return { correct: true };
  };

  updateParams = (params?: BlockParams) => {
    //do a diff between saved params and updated params
    //if they are different, update the block
    if (params) {
      const keys = Object.keys(params);
      if (keys.length !== Object.keys(this.currentParams).length) {
        this.currentParams = params;
        this.initialize();
        return;
      }

      for (const key of keys) {
        if (!areParamsTheSame(params[key], this.currentParams[key])) {
          this.currentParams = params;
          this.initialize();
          return;
        }
      }
    }
  };

  forward = (inputs: Tensor[], sample?: boolean): Tensor => {
    return inputs[0];
  };

  getAdditionalOutputs(): Record<string, Tensor> {
    //return in the form of:
    // {"|out1|": tf.tensor1d([1]), "|out2|": tf.tensor1d([1])}
    return {};
  }

  saveValue(value: Tensor) {
    this.value = value;
  }

  saveGrad(grads: Tensor) {
    this.grads = grads;
  }

  //some blocks, like multiply, don't have state
  getValue(): Tensor | null {
    return this.value ?? null;
  }

  getGrads(): Tensor | null {
    return this.grads ?? null;
  }

  getWeights(): tf.Variable[] | null {
    return null;
  }

  saveWeightGrads(grads: Tensor[]) {
    this.weightGrads = grads;
  }

  destroy() {
    //release all the tensors
    if (this.internalTensor) {
      this.internalTensor.dispose();
    }

    if (this.value) {
      this.value.dispose();
    }

    if (this.grads) {
      this.grads.dispose();
    }

    if (this.weightGrads) {
      for (const grad of this.weightGrads) {
        grad.dispose();
      }
    }

    for (const key of Object.keys(this.viewables)) {
      this.viewables[key].dispose();
    }

    if (this.weightGrads) {
      for (const grad of this.weightGrads) {
        grad.dispose();
      }
    }

    this.viewables = {};

    this.internalTensor = null;
  }

  render: () => ReactElement | null = () => {
    return null;
  };
}
