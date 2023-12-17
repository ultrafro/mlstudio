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
    mnistSampler.setProportions(
      shape.trainProportion,
      shape.valProportion,
      shape.testProportion
    );
    this.newSample();
  }

  newSample() {
    const result = mnistSampler.getSample("train");
    if (result) {
      this.input = result.img;
      this.output = result.label;

      const imageData = this.input as ImageData;
      const labels = this.output as number[];

      const img = new ImageData(28, 28);

      for (let xx = 0; xx < 28; xx++) {
        for (let yy = 0; yy < 28; yy++) {
          const idx = xx + yy * 28;
          const r = imageData.data[idx * 4 + 0];
          const g = imageData.data[idx * 4 + 1];
          const b = imageData.data[idx * 4 + 2];
          const a = imageData.data[idx * 4 + 3];
          const avg = (r + g + b) / 3;

          img.data[idx] = avg;
        }
      }

      const imgTensor = tf.browser.fromPixels(img, 1);
      //only slice the r channel of imgTensor
      imgTensor.slice([0], [1]);

      const labelTensor = tf.tensor1d(labels);

      this.inputTensor = imgTensor;
      this.outputTensor = labelTensor;
    }
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
