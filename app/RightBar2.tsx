import { ActualBlocks } from "./Blocks/ActualBlocks";
import Chart from "./Chart";
import { ShadowGraph } from "./CustomComponents/Button";
import TensorViewer from "./CustomComponents/TensorViewer";
import { BlockType, Blocks } from "./model";
import { useLossData } from "./utils";

export default function RightBar2() {
  const lossData = useLossData();

  const inputBlock = Object.values(ActualBlocks)
    .find((block) => block.type === BlockType.INPUT)
    ?.getValue();
  const predictedBlock = Object.values(ActualBlocks)
    .find((block) => block.type === BlockType.OUTPUT)
    ?.getValue();
  const correctAnswerBlock = Object.values(ActualBlocks)
    .find((block) => block.type === BlockType.DATA_OUT)
    ?.getValue();

  return (
    <div className="flex items-center justify-center absolute right-5 h-full pointer-events-none">
      <div className="flex flex-col items-center bg-white p-4 shadow-lg  rounded-md pointer-events-auto">
        <p className="text-center">Input</p>
        <TensorViewer tensor={inputBlock} sizePX={100} minimal={true} />
        <p className="text-center">Correct Output</p>
        <TensorViewer tensor={correctAnswerBlock} sizePX={100} minimal={true} />
        <p className="text-center">Prediction</p>
        <TensorViewer tensor={predictedBlock} sizePX={100} minimal={true} />

        <ShadowGraph
          xData={lossData.x}
          yData={lossData.y}
          label={"Training Loss"}
        />

        {/* <p className="text-center">Loss on Training set {2}</p>
        <p className="text-center">Loss on Validation set {2}</p>
        <p className="text-center">Loss on Test set {2}</p> */}
      </div>
    </div>
  );
}
