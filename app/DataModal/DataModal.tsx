import { useState, useContext, useMemo } from "react";
import { FlexCol, FlexRow, FlexColCenter, FlexRowCenter, Modal } from "../Flex";
import { SupervisedDataShape } from "../model";
import DataPreview from "./DataPreview";
import { SessionProivder } from "../Providers";
import * as tf from "@tensorflow/tfjs";

export function DataModal(props: { onClose: () => void }) {
  const sessionContext = useContext(SessionProivder);

  const data = sessionContext.session.supervisedDataShape;
  const setData: (shape: SupervisedDataShape) => void = (
    shape: SupervisedDataShape
  ) => {
    sessionContext.setSession({
      ...sessionContext.session,
      supervisedDataShape: shape,
    });
  };

  // const [data, setData] = useState<SupervisedDataShape>({
  //   srcType: "MNIST",
  //   inputDimensions: [28, 28, 1],
  //   outputDimensions: [10],
  //   inputType: "image",
  //   outputType: "numbers",
  //   trainProportion: 0.8,
  //   valProportion: 0.1,
  //   testProportion: 0.1,
  // });

  return (
    <Modal>
      <FlexColCenter>
        <FlexColCenter
          style={{
            width: "800px",
            minHeight: "400px",
            justifyContent: "space-around",
          }}
        >
          <SourceComponent data={data} setData={setData} />
          <FlexRowCenter>
            <FlexColCenter>
              <InputComponent
                data={data}
                setData={setData}
                disabled={data.srcType == "MNIST"}
              />
            </FlexColCenter>
            <DataPreview data={data} />
          </FlexRowCenter>
        </FlexColCenter>
      </FlexColCenter>
      <div
        style={{
          position: "absolute",
          bottom: "0px",
          right: "0px",
          padding: "24px",
        }}
      >
        <button onClick={props.onClose}>Close</button>
      </div>
    </Modal>
  );
}

// Subcomponent for Source
const SourceComponent = ({
  data,
  setData,
}: {
  data: SupervisedDataShape;
  setData: (data: SupervisedDataShape) => void;
}) => {
  return (
    <FlexRowCenter>
      <label>Source: </label>
      <select
        value={data.srcType}
        onChange={(e) => {
          const newData: SupervisedDataShape = {
            ...data,
          };

          if (e.target.value === "MNIST") {
            newData.inputDimensions = [28, 28, 1];
            newData.outputDimensions = [10];
            newData.inputType = "image";
            newData.outputType = "numbers";
            newData.srcType = "MNIST";
          } else {
            newData.inputDimensions = [1];
            newData.outputDimensions = [1];
            newData.inputType = "numbers";
            newData.outputType = "numbers";
            newData.customFunction = (input: tf.Tensor) => {
              const output = tf.mul(input, tf.scalar(2));
              return output;
            };
            newData.srcType = "CUSTOM";
          }

          newData.srcType = e.target.value as any;

          setData(newData);
        }}
      >
        <option value="MNIST">MNIST</option>
        <option value="CUSTOM">Custom</option>
      </select>
    </FlexRowCenter>
  );
};

// Subcomponent for ImageInput
const ImageInput = ({
  data,
  setData,
  isOutput,
  disabled,
}: {
  data: SupervisedDataShape;
  setData: (data: SupervisedDataShape) => void;
  isOutput?: boolean;
  disabled?: boolean;
}) => {
  const width = isOutput
    ? data.outputDimensions?.[0] ?? 0
    : data.inputDimensions?.[0] ?? 0;
  const height = isOutput
    ? data.outputDimensions?.[1] ?? 0
    : data.inputDimensions?.[1] ?? 0;
  const colorDepth = isOutput
    ? data.outputDimensions?.[2] ?? 0
    : data.inputDimensions?.[2] ?? 0;

  const setWidth = (width: number) => {
    if (isOutput) {
      setData({ ...data, inputDimensions: [width, height, colorDepth] });
    } else {
      setData({ ...data, outputDimensions: [width, height, colorDepth] });
    }
  };

  const setHeight = (height: number) => {
    if (isOutput) {
      setData({ ...data, inputDimensions: [width, height, colorDepth] });
    } else {
      setData({ ...data, outputDimensions: [width, height, colorDepth] });
    }
  };

  const setColorDepth = (colorDepth: number) => {
    if (isOutput) {
      setData({ ...data, inputDimensions: [width, height, colorDepth] });
    } else {
      setData({ ...data, outputDimensions: [width, height, colorDepth] });
    }
  };

  return (
    <FlexColCenter>
      <FlexRowCenter style={{ justifyContent: "space-between" }}>
        <label>Width: </label>
        <input
          disabled={disabled}
          type="number"
          value={width}
          width={"100px"}
          onChange={(e) => setWidth(Number(e.target.value))}
        />
      </FlexRowCenter>

      <FlexRowCenter style={{ justifyContent: "space-between" }}>
        <label>Height: </label>
        <input
          disabled={disabled}
          type="number"
          value={height}
          width={"100px"}
          onChange={(e) => setHeight(Number(e.target.value))}
        />
      </FlexRowCenter>

      <FlexRowCenter style={{ justifyContent: "space-between" }}>
        <label>Color Depth: </label>
        <input
          disabled={disabled}
          type="number"
          value={colorDepth}
          width={"100px"}
          onChange={(e) => setColorDepth(Number(e.target.value))}
        />
      </FlexRowCenter>
    </FlexColCenter>
  );
};

// Subcomponent for TextInput
const TextInput = ({
  data,
  setData,
  isOutput,
  disabled,
}: {
  data: SupervisedDataShape;
  setData: (data: SupervisedDataShape) => void;
  isOutput?: boolean;
  disabled?: boolean;
}) => {
  const textLength = isOutput
    ? data.outputDimensions?.[0] ?? 0
    : data.inputDimensions?.[0] ?? 0;
  const setTextLength = (textLength: number) => {
    if (isOutput) {
      setData({ ...data, outputDimensions: [textLength] });
    } else {
      setData({ ...data, inputDimensions: [textLength] });
    }
  };

  return (
    <FlexRowCenter style={{ justifyContent: "space-between" }}>
      <label>Text Length: </label>
      <input
        disabled={disabled}
        type="number"
        value={textLength}
        width={"100px"}
        onChange={(e) => setTextLength(Number(e.target.value))}
      />
    </FlexRowCenter>
  );
};

// Subcomponent for NumberInput
const NumberInput = ({
  data,
  setData,
  isOutput,
  disabled,
}: {
  data: SupervisedDataShape;
  setData: (data: SupervisedDataShape) => void;
  isOutput?: boolean;
  disabled?: boolean;
}) => {
  const textLength = isOutput
    ? data.outputDimensions?.[0] ?? 0
    : data.inputDimensions?.[0] ?? 0;
  const setTextLength = (textLength: number) => {
    if (isOutput) {
      setData({ ...data, outputDimensions: [textLength] });
    } else {
      setData({ ...data, inputDimensions: [textLength] });
    }
  };

  return (
    <FlexRowCenter style={{ justifyContent: "space-between" }}>
      <label>Number Dimensionality: </label>
      <input
        disabled={disabled}
        type="number"
        value={textLength}
        width={"100px"}
        onChange={(e) => setTextLength(Number(e.target.value))}
      />
    </FlexRowCenter>
  );
};

// Main Component
const InputComponent = ({
  data,
  setData,
  disabled,
}: {
  data: SupervisedDataShape;
  setData: (data: SupervisedDataShape) => void;
  disabled?: boolean;
}) => {
  const inputType = data.inputType;
  const setInputType = (newInputType: string) => {
    let newInputDimensions = [...data.inputDimensions];

    if (newInputType === "image") {
      if (newInputDimensions.length != 3) {
        newInputDimensions = [28, 28, 1];
      }
    }

    if (newInputType === "text") {
      if (newInputDimensions.length != 1) {
        newInputDimensions = [10];
      }
    }

    if (newInputType === "numbers") {
      if (newInputDimensions.length != 1) {
        newInputDimensions = [10];
      }
    }

    setData({
      ...data,
      inputType: newInputType as any,
      inputDimensions: newInputDimensions,
    });
  };

  const outputType = data.outputType;
  const setOutputType = (newInputType: string) => {
    let newInputDimensions = [...data.outputDimensions];

    if (newInputType === "image") {
      if (newInputDimensions.length != 3) {
        newInputDimensions = [28, 28, 1];
      }
    }

    if (newInputType === "text") {
      if (newInputDimensions.length != 1) {
        newInputDimensions = [10];
      }
    }

    if (newInputType === "numbers") {
      if (newInputDimensions.length != 1) {
        newInputDimensions = [10];
      }
    }

    setData({
      ...data,
      outputType: newInputType as any,
      outputDimensions: newInputDimensions,
    });
  };

  return (
    <FlexColCenter>
      <FlexColCenter>
        <h1>Input</h1>
        <FlexRowCenter style={{ justifyContent: "space-between" }}>
          <h2>Input Type: </h2>
          <select
            disabled={disabled}
            value={inputType}
            onChange={(e) => setInputType(e.target.value)}
          >
            <option value="image">Image</option>
            <option value="text">Text</option>
            <option value="numbers">Numbers</option>
          </select>
        </FlexRowCenter>

        <FlexRowCenter>
          {inputType === "image" && (
            <ImageInput disabled={disabled} data={data} setData={setData} />
          )}
          {inputType === "text" && (
            <TextInput disabled={disabled} data={data} setData={setData} />
          )}
          {inputType === "numbers" && (
            <NumberInput disabled={disabled} data={data} setData={setData} />
          )}
        </FlexRowCenter>
      </FlexColCenter>

      <FlexColCenter>
        <h1>Output</h1>
        <FlexRowCenter style={{ justifyContent: "space-between" }}>
          <h2>Output Type: </h2>
          <select
            value={outputType}
            onChange={(e) => setOutputType(e.target.value)}
            disabled={disabled}
          >
            <option value="image">Image</option>
            <option value="text">Text</option>
            <option value="numbers">Numbers</option>
          </select>
        </FlexRowCenter>

        <FlexRowCenter>
          {outputType === "image" && (
            <ImageInput
              disabled={disabled}
              data={data}
              setData={setData}
              isOutput={true}
            />
          )}
          {outputType === "text" && (
            <TextInput
              disabled={disabled}
              data={data}
              setData={setData}
              isOutput={true}
            />
          )}
          {outputType === "numbers" && (
            <NumberInput
              disabled={disabled}
              data={data}
              setData={setData}
              isOutput={true}
            />
          )}
        </FlexRowCenter>
      </FlexColCenter>
    </FlexColCenter>
  );
};
