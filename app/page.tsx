"use client"; //
import { MantineProvider, createTheme } from "@mantine/core";

import Image from "next/image";
import { Mode, useMode } from "./utils";
import TopBar from "./TopBar";
import LeftBar from "./LeftBar";
import GraphDisplay from "./GraphDisplay";
import { FlexCol, FlexRow } from "./Flex";
import { useState } from "react";
import { DataModal } from "./DataModal/DataModal";

export default function Home() {
  const { mode, setMode } = useMode();
  const [dataOpen, setDataOpen] = useState<boolean>(false);

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
              {mode == Mode.Train && <LeftBar />}
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
      </MantineProvider>
    </main>
  );
}
