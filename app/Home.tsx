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

export default function MLStudio() {
  const { mode, setMode } = useMode();
  const [dataOpen, setDataOpen] = useState<boolean>(false);

  const [session, setSession] = useState<StudioSession>({ ...DEFAULT_SESSION });
  const sessionProviderValue = useMemo(() => {
    return { session, setSession };
  }, [session, setSession]);

  useEffect(() => {
    actualData.setSupervisedDataShape(session.supervisedDataShape);
  }, [session.supervisedDataShape]);

  //return a full screen div with white background using tailwind
  return (
    <SessionProivder.Provider value={sessionProviderValue}>
      <MantineProvider>
        <div className="bg-blue-500  w-full h-full">
          {/* Full Screen Graph */}
          <div className="w-full h-full absolute p-5">
            <ReactFlowProvider>
              <GraphDisplay />
            </ReactFlowProvider>
          </div>

          {/* Top Bar */}
          <TopBar2 />

          {/* Left Bar */}
          <LeftBar2 />

          {/* Right Bar */}
          <RightBar2 />
        </div>
      </MantineProvider>
    </SessionProivder.Provider>
  );
}
