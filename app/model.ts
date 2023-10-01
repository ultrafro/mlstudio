export type block = {
  name: string;
  icon: string;
};

export const tensorBlock: block = {
  name: "Tensor",
  icon: "icons/run.png",
};

export const blocks: block[] = [tensorBlock, tensorBlock];

export type SupervisedDataShape = {
  inputDimensions: number[];
  outputDimensions: number[];
  srcType: "MNIST" | "CUSTOM";
  inputType: "image" | "text" | "numbers";
  outputType: "image" | "text" | "numbers";
  trainProportion: number;
  valProportion: number;
  testProportion: number;
  fetchScript?: string;
};
