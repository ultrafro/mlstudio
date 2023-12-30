import * as tf from "@tensorflow/tfjs";
import { BlockParams, BlockType } from "../../model";
import { BlockClass } from "../BlockClass";
import { Tensor, Rank, layers } from "@tensorflow/tfjs";
import { areParamsTheSame } from "@/app/utils";
import LinearBlockEditor from "../BlockEditors/LinearBlockEditor";
import { mainModule } from "process";

export class LinearBlock extends BlockClass {
  type = BlockType.LINEAR;

  model: tf.Sequential | null = null;
  denseLayer: any | null = null;
  units: number = 0;

  constructor(id: string) {
    super(id, false);
  }

  override initialize = (params?: BlockParams): void => {
    const inputSize = this.currentParams["inputSize"] as number | undefined;
    const outputSize = this.currentParams["outputSize"] as number | undefined;

    if (inputSize == undefined || outputSize == undefined) {
      return;
    }

    //if either is null or nan, return
    if (isNaN(inputSize) || isNaN(outputSize)) {
      return;
    }

    this.units = outputSize;

    // Define the configuration for the dense layer
    const config = {
      units: this.units, // Number of units in the dense layer
      activation: "relu", // Activation function, you can change it to 'sigmoid', 'tanh', etc.
      inputShape: [inputSize], // Input shape, should match the size of your input tensor,
      trainable: true,
    };

    this.model?.dispose();
    // this.denseLayer?.dispose();

    this.model = tf.sequential();

    // Create the dense layer
    this.denseLayer = layers.dense(config as any);

    //for some reason variables only populate when added to a model :(
    this.model.add(this.denseLayer);
  };

  forward = (inputs: Tensor[]): Tensor => {
    // Apply the dense layer to the input tensor

    let input = inputs[0];
    if (input.shape.length == 1) {
      input = tf.reshape(input, [1, input.shape[0]]);
    }

    const outputTensor = this.denseLayer.apply(input);

    return outputTensor as Tensor;
  };

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    if (inputs.length != 1) {
      return null;
    }

    return [this.units];
  };

  override areInputsCorrect = (
    inputs: (number[] | null)[]
  ): { correct: boolean; reason?: string } => {
    if (inputs.length != 1) {
      return { correct: false, reason: "Linear block must have 1 input" };
    }

    //if any is null, return false
    if (inputs[0] == null) {
      return {
        correct: false,
        reason: "Linear block must have a non-empty input",
      };
    }

    const squeezedSize = inputs[0].filter((x) => x != 1);

    if (this.currentParams.inputSize != squeezedSize[0]) {
      return {
        correct: false,
        reason:
          "Input shape must match the shape of the Linear block. Got: " +
          squeezedSize[0] +
          " Expected: " +
          this.currentParams.inputSize,
      };
    }

    return { correct: true };
  };

  override saveValue(value: Tensor) {
    this.value = value;
  }

  override getWeights(): tf.Variable[] | null {
    return this.denseLayer?.getWeights() ?? null;
  }

  override render = () => {
    return <LinearBlockEditor id={this.id} />;
  };
}
