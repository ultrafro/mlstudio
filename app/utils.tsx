import { useState } from "react";

export enum Mode {
  Train = "Train",
  Run = "Run",
}

export const useMode = () => {
  const [mode, setMode] = useState<Mode>(Mode.Train);
  return { mode, setMode };
};
