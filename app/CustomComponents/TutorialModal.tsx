import { useContext, useState } from "react";
import { SessionProivder } from "../Providers";
import { Network, SupervisedDataShape } from "../model";
import { BASIC_WORFKLOW_GRAPH } from "../Samples/BasicWorkflowGraph";
import { basicLinearGraph } from "../Samples/basicLinearGraph";
import { SIMPLE_MULTIPLY_LEARNING_GRAPH } from "../Samples/SimpleMultiplyLearningGraph";
import * as tf from "@tensorflow/tfjs";
import { useResetNonReactStuff } from "../utils";
import { BLANK_GRAPH } from "../Samples/blankGraph";

const sections: { title: string; description: string; src: string }[] = [
  {
    title: "Training a model",
    description:
      "You can train a model by clicking train-1-step or train continuously",
    src: "/tutorial/running2.gif",
  },
  {
    title: "Designing a model",
    description:
      "You can set up and design a model by dragging and dropping blocks",
    src: "/tutorial/placement.gif",
  },
  {
    title: "Editing Values",
    description:
      "Some blocks can be customized, you can change their values / dimensions. You'll get an error if it's the wrong size",
    src: "/tutorial/changingValue.gif",
  },
  {
    title: "Inspecting a live-model",
    description:
      "You can click on the eye-icon to inspect the values and gradients of a block",
    src: "/tutorial/inspect.gif",
  },
];
export default function TutorialModal({ onClose }: { onClose: () => void }) {
  localStorage.setItem("hasSeenTutorial", "true");

  const [section, setSection] = useState<number>(0);

  const currentSection = sections[section];

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="flex flex-col absolute top-0 left-0 w-full h-full items-center justify-center">
      <div className="flex flex-col items-center  shadow-2xl bg-white rounded-lg relative p-12">
        {/* close button on top right */}
        <button
          className="absolute top-4 right-4  select-none"
          onClick={onClose}
        >
          <p className="text-center">x</p>
        </button>

        {/* Title */}
        <h1 className="text-2xl text-center font-bold">
          {currentSection.title}
        </h1>

        <div className="flex flex-row items-center justify-center gap-2.5 overflow-hidden relative">
          {/* Left Button */}
          <button
            className="flex flex-col items-center justify-center z-10"
            onClick={() => {
              if (section > 0) {
                setSection((section - 1) % sections.length);
              }
            }}
          >
            <p className="text-center">{"<"}</p>
          </button>

          {/* Graph */}
          <div className="flex flex-col items-center justify-center w-[600px] h-[500px] transition-transform duration-300 ease-in-out transform translate-x-[-${section * 100}%]">
            <div
              style={{
                width: "100%",
                height: "100%",
                backgroundImage: `url(${currentSection.src})`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
              }}
            />
          </div>

          {/* Right Button */}
          <button
            className="flex flex-col items-center justify-center  z-10"
            onClick={() => {
              if (section < sections.length - 1) {
                setSection((section + 1) % sections.length);
              } else {
                onClose();
              }
            }}
          >
            <p className="text-center">{">"}</p>
          </button>
        </div>

        {/* Description */}
        <p className="text-center w-[500px]">{currentSection.description}</p>

        {/* set of progress dots */}
        <div className="flex flex-row items-center justify-center  gap-2.5 p-4">
          {sections.map((_, idx) => (
            <div
              key={"dot_" + idx}
              className={`w-2 h-2 rounded-full ${
                idx === section ? "bg-blue-500" : "bg-gray-500"
              }`}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}
