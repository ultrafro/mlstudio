"use client"; //
import "@mantine/core/styles.css";

import { MantineProvider, createTheme } from "@mantine/core";

import Image from "next/image";
import { useMode } from "./utils";
import TopBar from "./TopBar";
import LeftBar from "./LeftBar";
import GraphDisplay from "./Graph/GraphDisplay";
import { FlexCol, FlexRow } from "./Flex";
import { useEffect, useMemo, useState } from "react";
import { DataModal } from "./DataModal/DataModal";
import { SessionProivder } from "./Providers";
import { DEFAULT_SESSION, StudioSession } from "./model";
import { ReactFlowProvider } from "reactflow";
import { tensorflowTest3 } from "./Blocks/ActualBlocks";
import { actualData } from "./Blocks/ActualData";
import TopBar2 from "./TopBar2";
import LeftBar2 from "./LeftBar2";
import RightBar2 from "./RightBar2";
import TrainingModal from "./CustomComponents/TrainingModal";
import FileModal from "./CustomComponents/FileModal";
import TutorialModal from "./CustomComponents/TutorialModal";

export default function MLStudio() {
  const { mode, setMode } = useMode();
  const [dataOpen, setDataOpen] = useState<boolean>(false);
  const [trainingModalOpen, setTrainingModalOpen] = useState<boolean>(false);
  const [fileModalOpen, setFileModalOpen] = useState<boolean>(false);
  const [tutorialModalOpen, setTutorialModalOpen] = useState<boolean>(false);

  const [session, setSession] = useState<StudioSession>({ ...DEFAULT_SESSION });
  const sessionProviderValue = useMemo(() => {
    return { session, setSession };
  }, [session, setSession]);

  useEffect(() => {
    const hasSeenTutorial =
      typeof window !== "undefined"
        ? window.localStorage.getItem("hasSeenTutorial")
        : false;

    if (!hasSeenTutorial) {
      setTutorialModalOpen(true);
    }
  }, []);

  useEffect(() => {
    actualData.setSupervisedDataShape(session.supervisedDataShape);
  }, [session.supervisedDataShape]);

  //return a full screen div with white background using tailwind
  return (
    <SessionProivder.Provider value={sessionProviderValue}>
      <MantineProvider>
        <div className="bg-blue-500  w-full h-full relative">
          <div className="flex flex-col items-center justify-center w-full h-full gap-2.5 p-4 ">
            {/* Top Bar */}
            <TopBar2
              openData={() => {
                setDataOpen(true);
              }}
              openTrainingModal={() => {
                setTrainingModalOpen(true);
              }}
              openFile={() => {
                setFileModalOpen(true);
              }}
            />
            <div className="flex flex-row items-center justify-center w-full h-full  gap-2.5">
              {/* Graph */}
              <div className="flex flex-col items-center justify-center w-full h-full">
                <ReactFlowProvider>
                  <GraphDisplay />
                </ReactFlowProvider>
              </div>
            </div>

            {/* Left Bar */}
            <LeftBar2 />
          </div>
        </div>
        {dataOpen && (
          <DataModal
            onClose={() => {
              setDataOpen(false);
            }}
          />
        )}
        {trainingModalOpen && (
          <TrainingModal
            onClose={() => {
              setTrainingModalOpen(false);
            }}
          />
        )}
        {fileModalOpen && (
          <FileModal
            onClose={() => {
              setFileModalOpen(false);
            }}
          />
        )}
        {tutorialModalOpen && (
          <TutorialModal
            onClose={() => {
              setTutorialModalOpen(false);
            }}
          />
        )}

        {/* a link with the github icon on the top right */}
        <a href="https://github.com/ultrafro/mlstudio">
          <div className="absolute top-0 right-0 z-10 flex flex-row items-center justify-center gap-2.5 p-4rounded-lg shadow-sm m-4">
            <Image src="/icons/gh.png" width={32} height={32} alt="github" />
            {/* <p className="text-center text-white">github</p> */}
          </div>
        </a>
      </MantineProvider>
    </SessionProivder.Provider>
  );
}
