import { useContext, useEffect, useState } from "react";
import { SessionProivder } from "./Providers";
import { initializeBlocks } from "./Blocks/ActualBlocks";

export enum Mode {
  Train = "Train",
  Run = "Run",
}

export const useMode = () => {
  const [mode, setMode] = useState<Mode>(Mode.Train);
  return { mode, setMode };
};

export function useInitializeBlocks() {
  const session = useContext(SessionProivder);
  const [initialized, setInitialized] = useState<boolean>(false);
  useEffect(() => {
    if (session.session.network && !initialized) {
      setInitialized(true);
      initializeBlocks(session.session.network);
    }
  }, [initialized, session.session]);
}
