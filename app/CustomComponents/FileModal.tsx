import { useContext } from "react";
import { SessionProivder } from "../Providers";
import { Network, SupervisedDataShape } from "../model";
import { BASIC_WORFKLOW_GRAPH } from "../Samples/BasicWorkflowGraph";
import { basicLinearGraph } from "../Samples/basicLinearGraph";
import { SIMPLE_MULTIPLY_LEARNING_GRAPH } from "../Samples/SimpleMultiplyLearningGraph";
import * as tf from "@tensorflow/tfjs";
import { useResetNonReactStuff } from "../utils";
import { BLANK_GRAPH } from "../Samples/blankGraph";

const MNISTShape: SupervisedDataShape = {
  inputDimensions: [28, 28],
  outputDimensions: [10],
  srcType: "MNIST",
  inputType: "image",
  outputType: "numbers",
  trainProportion: 0.8,
  valProportion: 0.1,
  testProportion: 0.1,
};

const Files: {
  name: string;
  network: Network;
  dataShape: SupervisedDataShape;
}[] = [
  { name: "Blank", network: BLANK_GRAPH as any, dataShape: MNISTShape },
  {
    name: "MNIST raw",
    network: BASIC_WORFKLOW_GRAPH as any,
    dataShape: MNISTShape,
  },
  {
    name: "MNIST Fully Connected Layer",
    network: basicLinearGraph as any,
    dataShape: MNISTShape,
  },
  {
    name: "Learn basic multiplication",
    network: SIMPLE_MULTIPLY_LEARNING_GRAPH as any,
    dataShape: {
      inputDimensions: [1],
      outputDimensions: [1],
      srcType: "CUSTOM",
      inputType: "numbers",
      outputType: "numbers",
      trainProportion: 0.8,
      valProportion: 0.1,
      testProportion: 0.1,
      customFunction: (input: tf.Tensor) => {
        const output = tf.mul(input, tf.scalar(2));
        return output;
      },
    },
  },
];

export default function FileModal({ onClose }: { onClose: () => void }) {
  const session = useContext(SessionProivder);
  const reset = useResetNonReactStuff();

  return (
    <div className="flex flex-col absolute top-0 left-0 w-full h-full items-center justify-center">
      <div className="flex flex-col items-around justify-around  w-[30%] h-[30%] shadow-2xl bg-white rounded-lg relative">
        {/* close button on top right */}
        <button
          className="absolute top-4 right-4  select-none"
          onClick={onClose}
        >
          <p className="text-center">x</p>
        </button>

        {/* wrapped row of buttons */}
        <div className="flex flex-row items-around justify-around flex-wrap">
          {Files.map((file, idx) => {
            return (
              <button
                key={"file_button_" + idx}
                className="w-32 h-32 text-sm font-normal font-inter text-center bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring focus:border-blue-700 shadow-md rounded-lg"
                onClick={() => {
                  reset();
                  session.setSession({
                    ...session.session,
                    network: file.network,
                    supervisedDataShape: file.dataShape,
                    initialized: false,
                  });
                  onClose();
                }}
              >
                {file.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
