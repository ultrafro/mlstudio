import { SupervisedDataShape } from "../model";
import * as tf from "@tensorflow/tfjs";
import mnistSampler from "../MNISTSampler";

class ActualData {
  supervisedDataShape?: SupervisedDataShape;

  input: any | null = null;
  output: any | null = null;

  setSupervisedDataShape(shape: SupervisedDataShape) {
    this.supervisedDataShape = shape;
    mnistSampler.setProportions(
      shape.trainProportion,
      shape.valProportion,
      shape.testProportion
    );
  }

  newSample() {
    const result = mnistSampler.getSample("train");
    if (result) {
      this.input = result.img;
      this.output = result.label;
    }
  }

  getCurrentSample(): { input: tf.Tensor; output: tf.Tensor } {
    if (!this.input || !this.output) {
      return {
        input: tf.tensor1d(this.input),
        output: tf.tensor1d(this.output),
      };
    }

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

    const labelTensor = tf.tensor1d(labels);

    return {
      input: imgTensor,
      output: labelTensor,
    };
  }
}

export const actualData: ActualData = new ActualData();
