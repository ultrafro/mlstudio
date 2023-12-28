import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SessionProivder } from "./Providers";
import {
  ActualBlocks,
  getBrokenBlocksList,
  getSortedBlockIdsUpToAndIncluding,
  initializeBlocks,
  trainBlocks,
} from "./Blocks/ActualBlocks";
import { nanoid } from "nanoid";
import { BlockType } from "./model";

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
    }

    if (session.session.network) {
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

export function squeezeDims(dims: number[]): number[] {
  const result: number[] = [];

  for (const dim of dims) {
    if (dim != 1) {
      result.push(dim);
    }
  }

  return result;
}

export function useCreateBlock(): (block: BlockType) => void {
  const session = useContext(SessionProivder);

  const createBlock = useCallback(
    (block: BlockType) => {
      const newBlockId = "|" + nanoid() + "|";
      const x = Math.random() * 300;
      const y = Math.random() * 300;

      session.setSession({
        ...session.session,
        network: {
          ...session.session.network,
          blocks: {
            ...session.session.network.blocks,
            [newBlockId]: {
              id: newBlockId,
              type: block as BlockType,
              x,
              y,
            },
          },
        },
      });
    },
    [session]
  );

  return createBlock;
}

export function useTrain1Step() {
  const session = useContext(SessionProivder);

  const train1Step = useCallback(() => {
    const result = getBrokenBlocksList(session.session.network);

    if (result.length > 0) {
      console.log("found broken blocks! not going to train", result);
      return;
    }

    //forwardBlocks(session.session.network);

    //todo: make this find the "final loss" block, right now it's hard coded
    trainBlocks("|7|", session.session.network, {}, 1);

    session.setSession({ ...session.session, blocksChanged: {} });
  }, [session]);

  return train1Step;
}
