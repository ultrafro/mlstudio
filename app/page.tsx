"use client"; //
import { MantineProvider, createTheme } from "@mantine/core";

import Image from "next/image";
import { Mode, useMode } from "./utils";
import TopBar from "./TopBar";
import LeftBar from "./LeftBar";
import GraphDisplay from "./Graph/GraphDisplay";
import { FlexCol, FlexRow } from "./Flex";
import { useMemo, useState } from "react";
import { DataModal } from "./DataModal/DataModal";
import { SessionProivder } from "./Providers";
import { DEFAULT_SESSION, StudioSession } from "./model";

export default function Home() {
  const { mode, setMode } = useMode();
  const [dataOpen, setDataOpen] = useState<boolean>(false);

  const [session, setSession] = useState<StudioSession>({ ...DEFAULT_SESSION });
  const sessionProviderValue = useMemo(() => {
    return { session, setSession };
  }, [session, setSession]);

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
                <LeftBar />
                <GraphDisplay />
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
