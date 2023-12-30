import { ActualBlocks } from "./Blocks/ActualBlocks";
import Chart from "./SimpleChart";
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
    <div className="flex flex-row items-center  ">
      <div className="flex flex-col items-center justify-center">
        <TensorViewer tensor={inputBlock} sizePX={100} minimal={true} />
        <p className="text-center">Input</p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <TensorViewer tensor={correctAnswerBlock} sizePX={100} minimal={true} />
        <p className="text-center">Correct Output</p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <TensorViewer tensor={predictedBlock} sizePX={100} minimal={true} />
        <p className="text-center">Prediction</p>
      </div>

      <ShadowGraph
        xData={lossData.x}
        yData={lossData.y}
        label={"Training Loss"}
        maxPoints={100}
      />

      {/* <p className="text-center">Loss on Training set {2}</p>
        <p className="text-center">Loss on Validation set {2}</p>
        <p className="text-center">Loss on Test set {2}</p> */}
    </div>
  );
}
