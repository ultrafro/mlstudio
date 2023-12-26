import { SupervisedDataShape } from "../model";
import * as tf from "@tensorflow/tfjs";
import mnistSampler from "../MNISTSampler";

class ActualData {
  supervisedDataShape?: SupervisedDataShape;

  input: any | null = null;
  output: any | null = null;

  inputTensor: tf.Tensor | null = null;
  outputTensor: tf.Tensor | null = null;

  setSupervisedDataShape(shape: SupervisedDataShape) {
    this.supervisedDataShape = shape;
    if (shape.srcType == "MNIST") {
      mnistSampler.setProportions(
        shape.trainProportion,
        shape.valProportion,
        shape.testProportion
      );
    }

    this.newSample();
  }

  newSample() {
    if (this.supervisedDataShape?.srcType == "MNIST") {
      this.newSampleMNIST();
    }
    if (this.supervisedDataShape?.srcType == "CUSTOM") {
      this.newSampleCustom();
    }
  }

  newSampleMNIST() {
    const result = mnistSampler.getSample("train");
    if (result) {
      this.input = result.img;
      this.output = result.label;

      const imageData = this.input as ImageData;
      const labels = this.output as number[];

      const imgTensor = tf.browser.fromPixels(imageData, 1);
      const scaledImageTensor = tf.mul(imgTensor, tf.scalar(1 / 255));

      const labelTensor = tf.tensor1d(labels);

      this.inputTensor = scaledImageTensor;
      this.outputTensor = labelTensor;
    }
  }

  newSampleCustom() {
    this.inputTensor = tf.randomNormal(
      this.supervisedDataShape?.inputDimensions || [1]
    );

    this.outputTensor =
      this.supervisedDataShape?.customFunction?.(this.inputTensor) ??
      tf.zeros(this.supervisedDataShape?.outputDimensions || [1]);
  }

  getCurrentSample(): { input: tf.Tensor; output: tf.Tensor } {
    if (!this.inputTensor || !this.outputTensor) {
      return {
        input: tf.tensor1d(this.input),
        output: tf.tensor1d(this.output),
      };
    }

    return {
      input: this.inputTensor,
      output: this.outputTensor,
    };
  }
}

export const actualData: ActualData = new ActualData();
