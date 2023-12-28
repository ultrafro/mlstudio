import { useContext } from "react";
import Button from "./CustomComponents/Button";
import { useTrain1Step, useTrainContinuously } from "./utils";
import { SessionProivder } from "./Providers";
import { IsTrainingContinuously } from "./Blocks/ActualBlocks";
import RightBar2 from "./RightBar2";

export default function TopBar2({
  openData,
  openTrainingModal,
}: {
  openData: () => void;
  openTrainingModal: () => void;
}) {
  const session = useContext(SessionProivder);

  const train1Step = useTrain1Step();

  const { startTrainingContinuously, stopTrainingContinuously } =
    useTrainContinuously();

  const isTrainingContinuously = IsTrainingContinuously.iterations ?? 0 > 0;

  return (
    <div className="flex items-center justify-center w-full pointer-events-none">
      <div className="flex flex-row  justify-between  items-center relative w-[90%] bg-white p-4 shadow-lg  h-40 rounded-md pointer-events-auto">
        {/*Training Settings*/}
        <div className="flex flex-row justify-center items-center">
          {/* <div className="flex flex-col items-center justify-center p-2   bg-gray-500 rounded-lg">
            <input
              type="number"
              className="w-10 h-6 text-xs font-normal font-['Inter'] text-center bg-gray-50"
              defaultValue={0.1}
              step={0.001}
            />
            <p className="text-xs text-center font-normal font-['Inter']">
              learning rate
            </p>
          </div> */}
          <Button
            src={"/icons/settings.png"}
            label="training settings"
            imgSize={32}
            override="w-24 h-[75px]"
            onClick={() => {
              console.log(session.session.network);
              openTrainingModal();
            }}
          />
          <Button
            src={"/icons/db.png"}
            label="data settings"
            imgSize={32}
            override="w-24 h-[75px]"
            onClick={openData}
          />
        </div>

        {/* Main Buttons */}
        <div className="flex flex-row justify-center items-cente bg-blue-200  p-4 rounded-lg shadow-lg">
          <Button
            src={"/icons/step.png"}
            label="train 1 step"
            override={"z-10"}
            onClick={train1Step}
          />
          {!isTrainingContinuously && (
            <Button
              src={"/icons/play.png"}
              label="train continuously"
              override={"z-10"}
              onClick={startTrainingContinuously}
            />
          )}
          {isTrainingContinuously && (
            <Button
              src={"/icons/pause.png"}
              label="stop training"
              override={"z-10"}
              onClick={stopTrainingContinuously}
            />
          )}
          <Button
            src={"/icons/rocket.png"}
            label="execute model (soon)"
            override={"z-10"}
            interactive={false}
          />
        </div>

        {/* Main Monitors */}
        <RightBar2 />
      </div>
    </div>
  );
}
