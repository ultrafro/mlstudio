import { useContext, useEffect, useRef, useState } from "react";
import { FlexCol, FlexColCenter, FlexRow } from "../Flex";
import { SessionProivder } from "../Providers";
import { MultiSelect, Select, Switch } from "@mantine/core";
import { ActualBlocks } from "../Blocks/ActualBlocks";

import Chart from "../SimpleChart";
import { Tensor, squeeze } from "@tensorflow/tfjs";
import TensorViewer from "../CustomComponents/TensorViewer";

const GraphTypes = ["histogram", "line", "image"];
type GraphType = (typeof GraphTypes)[number];

export default function SelectedGraph() {
  const session = useContext(SessionProivder);

  const [showGradients, setShowGradients] = useState<boolean>(false);
  const [graphType, setGraphType] = useState<GraphType>("image");

  const block = ActualBlocks[session.session.selectedBlockId ?? ""];

  if (!block) {
    return null;
  }

  const data = showGradients ? block.getGrads() : block.getValue();

  let dataAsNumberArray: Float32Array | Int32Array | Uint8Array =
    new Float32Array();
  try {
    dataAsNumberArray = data?.dataSync() ?? new Float32Array();
  } catch (e) {
    console.log(e);
  }
  let mean = 0;
  let variance = 0;
  for (let i = 0; i < dataAsNumberArray.length; i++) {
    mean += dataAsNumberArray[i] / dataAsNumberArray.length;
  }

  for (let i = 0; i < dataAsNumberArray.length; i++) {
    variance +=
      Math.pow(dataAsNumberArray[i] - mean, 2) / dataAsNumberArray.length;
  }

  return (
    <FlexColCenter
      style={{
        justifyContent: "space-between",
        width: "350px",
        height: "350px",
        position: "absolute",
        top: 25,
        left: 25,
        border: "2px solid black",
        borderRadius: "10px",
        backgroundColor: "white",
      }}
    >
      {/* Values or Gradients */}
      <FlexRow
        style={{ width: "100%", justifyContent: "flex-end", padding: "10px" }}
      >
        <Switch
          label={showGradients ? "Showing Gradients" : "Showing Values"}
          checked={showGradients}
          onChange={(evt) => {
            setShowGradients(evt.currentTarget.checked);
          }}
        />
      </FlexRow>

      <TensorViewer tensor={data} sizePX={300} />

      {/* Dimension */}
      {/* <FlexRow style={{ justifyContent: "center" }}>
        <div>Dimension {data?.shape?.join("x")}</div>
      </FlexRow> */}

      {/* a close button on the top left */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
        }}
      >
        <button
          onClick={() => {
            //set selected to id in session
            const newSession = { ...session.session };
            newSession.selectedBlockId = "";
            session.setSession(newSession);
          }}
        >
          <img src="https://img.icons8.com/material-outlined/24/000000/close-window.png" />
        </button>
      </div>
    </FlexColCenter>
  );
}

function GraphImage({ data }: { data: Tensor }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasRef.current) {
      return;
    }

    const ctx = canvasRef.current.getContext("2d");

    if (!ctx) {
      return;
    }

    const squeezedTensor = squeeze(data);

    const shape = squeezedTensor?.shape ?? [];
    const width = Math.floor(shape[0] ?? 1);
    const height = Math.floor(shape[1] ?? 1);

    const beginSlice: number[] = [];
    const keepSize: number[] = [];

    for (let i = 0; i < shape.length; i++) {
      beginSlice.push(0);

      if (i < 2) {
        keepSize.push(-1);
      } else {
        keepSize.push(shape[i]);
      }
    }

    //take a slice of the first column of the tensor

    const firstSlice =
      shape.length > 1
        ? squeezedTensor.slice(beginSlice, keepSize)
        : squeezedTensor;

    //convert to a 2d array
    let dataAsNumberArray: Float32Array | Int32Array | Uint8Array =
      new Float32Array();
    try {
      dataAsNumberArray = data?.dataSync() ?? new Float32Array();
    } catch (e) {
      console.log(e);
    }

    let max: number | null = null;
    let min: number | null = null;
    for (let i = 0; i < dataAsNumberArray.length; i++) {
      if (max === null || dataAsNumberArray[i] > max) {
        max = dataAsNumberArray[i];
      }
      if (min === null || dataAsNumberArray[i] < min) {
        min = dataAsNumberArray[i];
      }
    }

    const imageData = new ImageData(width, height);

    for (let i = 0; i < dataAsNumberArray.length; i++) {
      for (let j = 0; j < 3; j++) {
        const denominator = Math.max((max ?? 0) - (min ?? 0), 1);
        imageData.data[4 * i + j] =
          ((dataAsNumberArray[i] - (min ?? 0)) / denominator) * 255;
      }
      imageData.data[4 * i + 3] = 255;
    }

    ctx.putImageData(imageData, 0, 0);
  });

  const squeezedTensor = squeeze(data);

  const shape = squeezedTensor?.shape ?? [];
  const width = Math.floor(shape[0] ?? 1);
  const height = Math.floor(shape[1] ?? 1);

  //return a canvas with the image data
  return (
    <div
      style={{
        width: "200px",
        height: "200px",
      }}
    >
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        style={{
          width: "100%",
          height: "100%",
        }}
      />
    </div>
  );
}

function GraphPlot({ data }: { data: Tensor | null }) {
  let dataAsNumberArray: Float32Array | Int32Array | Uint8Array =
    new Float32Array();
  try {
    dataAsNumberArray = data?.dataSync() ?? new Float32Array();
  } catch (e) {
    console.log(e);
  }

  return (
    <div
      style={{
        width: "200px",
        height: "200px",
      }}
    >
      <Chart y={dataAsNumberArray as any as number[]} />
    </div>
  );
}

function GraphHistogram({ data }: { data: Tensor | null }) {
  let dataAsNumberArray: Float32Array | Int32Array | Uint8Array =
    new Float32Array();
  try {
    dataAsNumberArray = data?.dataSync() ?? new Float32Array();
  } catch (e) {
    console.log(e);
  }
  const numbers = dataAsNumberArray as any as number[];

  const bins = 10;
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);
  const diff = Math.abs(max - min);

  const binSize = diff < 0.01 ? 0.01 : (max - min) / bins;

  const x: number[] = [];
  const y: number[] = [];

  for (let i = 0; i < bins; i++) {
    x.push(min + i * binSize);
    y.push(0);
  }

  for (let i = 0; i < numbers.length; i++) {
    const bin = Math.floor((numbers[i] - min) / binSize);
    y[bin]++;
  }

  return (
    <div
      style={{
        width: "200px",
        height: "200px",
      }}
    >
      <Chart x={x} y={y} />
    </div>
  );
}
