import { useContext, useEffect, useRef, useState } from "react";
import { FlexCol, FlexRow } from "../Flex";
import { SessionProivder } from "../Providers";
import { MultiSelect, Select, Switch } from "@mantine/core";
import { ActualBlocks } from "../Blocks/ActualBlocks";

import Chart from "../Chart";
import { Tensor, squeeze } from "@tensorflow/tfjs";

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

  const dataAsNumberArray = data?.dataSync() ?? [];

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
    <FlexCol
      style={{
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

      {/* Dimension */}
      <FlexRow style={{ justifyContent: "center" }}>
        <div>Dimension {data?.shape?.join("x")}</div>
      </FlexRow>

      {/* Graph */}
      <FlexRow
        style={{
          width: "100%",
          height: "100%",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {graphType === "image" && data && <GraphImage data={data} />}
        {graphType === "line" && <GraphPlot data={data} />}
        {graphType === "histogram" && <GraphHistogram data={data} />}
      </FlexRow>

      {/* Graph type select */}
      <FlexRow style={{ width: "100%", justifyContent: "center" }}>
        <Select
          allowDeselect={false}
          data={GraphTypes}
          value={graphType}
          onChange={(newVal) => {
            setGraphType(newVal || "image");
          }}
        />
      </FlexRow>

      {/* Mean and Variance Text */}
      <FlexRow style={{ width: "100%", justifyContent: "space-around" }}>
        <div>Mean: {mean.toFixed(2)}</div>
        <div>Variance: {variance.toFixed(2)}</div>
        <div>total size: {dataAsNumberArray.length}</div>
      </FlexRow>
    </FlexCol>
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
    const dataAsNumberArray = firstSlice?.dataSync() ?? [];

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
  const dataAsNumberArray = data?.dataSync() ?? [];

  return (
    <div
      style={{
        width: "200px",
        height: "200px",
      }}
    >
      <Chart y={dataAsNumberArray as number[]} />
    </div>
  );
}

function GraphHistogram({ data }: { data: Tensor | null }) {
  const dataAsNumberArray = data?.dataSync() ?? [];
  const numbers = dataAsNumberArray as number[];

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