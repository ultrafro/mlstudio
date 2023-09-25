"use client"; //
import { MantineProvider, createTheme } from "@mantine/core";

import Image from "next/image";
import { Mode, useMode } from "./utils";
import TopBar from "./TopBar";
import LeftBar from "./LeftBar";
import GraphDisplay from "./GraphDisplay";
import { FlexCol, FlexRow } from "./Flex";

export default function Home() {
  const { mode, setMode } = useMode();

  return (
    <main>
      <MantineProvider>
        <div style={{ width: "100vw", height: "100vh" }}>
          <FlexCol
            style={{
              width: "100%",
              height: "100%",
            }}
          >
            <TopBar />
            <FlexRow
              style={{
                width: "100%",
                height: "100%",
                justifyContent: "flex-start",
              }}
            >
              {mode == Mode.Train && <LeftBar />}
              <GraphDisplay />
            </FlexRow>
          </FlexCol>
        </div>
      </MantineProvider>
    </main>
  );
}
