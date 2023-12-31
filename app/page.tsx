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
import Home from "./Home";

let hasInitialized = false;

export default function Home1() {
  return <Home />;

  const { mode, setMode } = useMode();
  const [dataOpen, setDataOpen] = useState<boolean>(false);

  const [session, setSession] = useState<StudioSession>({ ...DEFAULT_SESSION });
  const sessionProviderValue = useMemo(() => {
    return { session, setSession };
  }, [session, setSession]);

  // console.log("session");
  // console.log(session.network);

  useEffect(() => {
    if (!hasInitialized) {
      hasInitialized = true;
      //tensorflowTest3();
    }
  }, []);

  useEffect(() => {
    actualData.setSupervisedDataShape(session.supervisedDataShape);
  }, [session.supervisedDataShape]);

  return (
    <main>
      <MantineProvider>
        <SessionProivder.Provider value={sessionProviderValue}>
          <div style={{ width: "100vw", height: "100vh" }}>
            <FlexCol
              style={{
                width: "100%",
                height: "100%",
              }}
            >
              <TopBar
                openData={() => {
                  setDataOpen(true);
                }}
              />
              <FlexRow
                style={{
                  width: "100%",
                  height: "100%",
                  justifyContent: "flex-start",
                }}
              >
                <div
                  style={{
                    width: "20%",
                    height: "100%",
                    overflowY: "auto",
                    position: "relative",
                  }}
                >
                  <LeftBar />
                </div>
                <ReactFlowProvider>
                  <GraphDisplay />
                </ReactFlowProvider>
              </FlexRow>
            </FlexCol>

            {dataOpen && (
              <DataModal
                onClose={() => {
                  setDataOpen(false);
                }}
              />
            )}
          </div>
        </SessionProivder.Provider>
      </MantineProvider>
    </main>
  );
}
