import { useContext, useEffect, useState } from "react";
import { SessionProivder } from "./Providers";
import {
  ActualBlocks,
  getSortedBlockIdsUpToAndIncluding,
  initializeBlocks,
} from "./Blocks/ActualBlocks";

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

    //loop through the blocks, compare the props, and if the props are different, update the block
    for (const block of Object.values(session.session.network.blocks)) {
      const actualBlock = ActualBlocks[block.id];
      if (actualBlock) {
        actualBlock.updateParams(block.params);
      }
    }
  }, [initialized, session.session]);
}

export function areParamsTheSame(
  param1: string | number | number[] | null | undefined,
  param2: string | number | number[] | null | undefined
): boolean {
  if (typeof param1 == "string" && typeof param2 == "string") {
    return param1 == param2;
  }

  if (typeof param1 == "number" && typeof param2 == "number") {
    return param1 == param2;
  }

  if (Array.isArray(param1) && Array.isArray(param2)) {
    if (param1.length != param2.length) {
      return false;
    }

    for (let i = 0; i < param1.length; i++) {
      if (param1[i] != param2[i]) {
        return false;
      }
    }

    return true;
  }

  //0 case is handled above ^
  if (!param1 && !param2) {
    return true;
  }

  return false;
}
