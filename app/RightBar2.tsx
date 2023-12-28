import Chart from "./Chart";
import { ShadowGraph } from "./CustomComponents/Button";

export default function RightBar2() {
  return (
    <div className="flex items-center justify-center absolute right-5 h-full pointer-events-none">
      <div className="flex flex-col items-center bg-white p-4 shadow-lg  rounded-md pointer-events-auto">
        <ShadowGraph xData={[5]} yData={[5]} label={"Training Loss"} />
        <ShadowGraph xData={[5]} yData={[5]} label={"Input"} />
        <ShadowGraph xData={[5]} yData={[5]} label={"Output"} />
        <ShadowGraph xData={[5]} yData={[5]} label={"Predicted"} />

        <p className="text-center">Loss on Training set {2}</p>
        <p className="text-center">Loss on Validation set {2}</p>
        <p className="text-center">Loss on Test set {2}</p>
      </div>
    </div>
  );
}
