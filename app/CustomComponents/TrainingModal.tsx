import { useContext } from "react";
import { SessionProivder } from "../Providers";

export default function TrainingModal({ onClose }: { onClose: () => void }) {
  const session = useContext(SessionProivder);
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

        {/* learning rate selector */}
        <div className="flex flex-row items-around justify-around">
          <p className="text-center">learning rate</p>
          <input
            type="number"
            className="w-10 h-6 text-xs font-normal font-['Inter'] text-center bg-gray-50"
            defaultValue={0.1}
            step={0.001}
            value={session.session.trainingSettings.learningRate}
            onChange={(e) => {
              session.setSession({
                ...session.session,
                trainingSettings: {
                  ...session.session.trainingSettings,
                  learningRate: parseFloat(e.target.value),
                },
              });
            }}
          />
        </div>

        {/* optimizer selector */}
        <div className="flex flex-row items-around justify-around">
          <p className="text-center">optimizer</p>
          <select
            className="w-24 h-6 text-xs font-normal font-['Inter'] text-center bg-gray-50"
            value={session.session.trainingSettings.optimizer}
            onChange={(e) => {
              session.setSession({
                ...session.session,
                trainingSettings: {
                  ...session.session.trainingSettings,
                  optimizer: e.target.value as any,
                },
              });
            }}
          >
            <option>sgd</option>
            <option>adagrad</option>
            <option>adam</option>
          </select>
        </div>
      </div>
    </div>
  );
}
