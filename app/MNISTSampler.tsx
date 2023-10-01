import mnist, { Datum } from "mnist";

class MNISTSampler {
  private train: number;
  private val: number;
  private test: number;

  private trainingSet: Datum[] = [];
  private testSet: Datum[] = [];

  constructor() {
    this.train = 0.8;
    this.val = 0.1;
    this.test = 0.1;
    this.setProportions(this.train, this.val, this.test);
  }

  setProportions(train: number, val: number, test: number) {
    this.train = train;
    this.val = val;
    this.test = test;

    const result = mnist.set(train * 10000, (val + test) * 10000);
    this.trainingSet = result.training;
    this.testSet = result.test;
  }

  getSample(type: "train" | "val" | "test"): {
    img: ImageData;
    label: number[];
  } | null {
    let sample = null;
    if (type == "train") {
      sample =
        this.trainingSet[Math.floor(Math.random() * this.trainingSet.length)];
    }
    if (type == "val") {
      const cutoff = this.val / (this.val + this.test);
      sample =
        this.testSet[Math.floor(Math.random() * this.testSet.length * cutoff)];
    }
    if (type == "test") {
      const cutoff = this.val / (this.val + this.test);

      sample =
        this.testSet[
          Math.floor(Math.random() * this.testSet.length * (1 - cutoff)) +
            this.testSet.length * cutoff
        ];
    }

    if (sample != null) {
      const imgPixels: number[] = [];
      for (let i = 0; i < sample.input.length; i++) {
        imgPixels.push(sample.input[i] * 255);
        imgPixels.push(sample.input[i] * 255);
        imgPixels.push(sample.input[i] * 255);
        imgPixels.push(255);
      }
      return {
        img: new ImageData(new Uint8ClampedArray(imgPixels), 28, 28),
        label: sample.output,
      };
    }

    return null;
  }
}

const mnistSampler = new MNISTSampler();
export default mnistSampler;
