import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { SessionProivder } from "./Providers";
import {
  ActualBlocks,
  IsTrainingContinuously,
  getBrokenBlocksList,
  getSortedBlockIdsUpToAndIncluding,
  initializeBlocks,
  loss,
  trainBlocks,
} from "./Blocks/ActualBlocks";
import { nanoid } from "nanoid";
import { BlockType, Blocks } from "./model";
import { NODE_WIDTH } from "./Graph/GraphNodeConstants";

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

  useEffect(() => {
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

    if (session.session.network && !session.session.initialized) {
      session.setSession({ ...session.session, initialized: true });
    }
  }, [session]);
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
    trainBlocks(
      "|7|",
      session.session.network,
      session.session.trainingSettings,
      1
    );

    recordLoss();

    session.setSession({ ...session.session, blocksChanged: {} });
  }, [session]);

  return train1Step;
}

export function useLossData() {
  const session = useContext(SessionProivder);

  const data = useMemo(() => {
    session; //update every session update
    const x: number[] = [];
    const y = loss;
    for (let i = 0; i < y.length; i++) {
      x.push(i);
    }

    const negativeLogLikelihood = y.map((loss) => {
      return -Math.log(loss);
    });

    return { x, y, negativeLogLikelihood };
  }, [session]);

  return data;
}

export function useTrainContinuously() {
  const session = useContext(SessionProivder);

  const ContinuousTrainingLoop = useCallback(() => {
    const iterations = IsTrainingContinuously.iterations ?? 0;

    if (iterations > 0) {
      const result = getBrokenBlocksList(session.session.network);

      if (result.length > 0) {
        console.log("found broken blocks! not going to train", result);
        return;
      }

      for (let i = 0; i < iterations; i++) {
        trainBlocks(
          "|7|",
          session.session.network,
          session.session.trainingSettings,
          1
        );
      }

      recordLoss();

      session.setSession({ ...session.session, blocksChanged: {} });
    }

    setTimeout(() => {
      ContinuousTrainingLoop();
    }, 10);
  }, [session]);

  const startTrainingContinuously = useCallback(() => {
    IsTrainingContinuously.iterations = 1;

    ContinuousTrainingLoop();
  }, [ContinuousTrainingLoop]);

  const stopTrainingContinuously = useCallback(() => {
    IsTrainingContinuously.iterations = undefined;
    session.setSession({ ...session.session });
  }, [session]);

  return { startTrainingContinuously, stopTrainingContinuously };
}

export function useResetNonReactStuff() {
  const session = useContext(SessionProivder);

  const resetEverything = useCallback(() => {
    loss.length = 0;

    //loop through actual blocks and release each one
    for (const block of Object.values(ActualBlocks)) {
      block.destroy();
      delete ActualBlocks[block.id];
    }
  }, []);

  return resetEverything;
}

function recordLoss() {
  for (const block of Object.values(ActualBlocks)) {
    if (block.type == BlockType.FINAL_LOSS) {
      const lossTensor = block.getValue();
      if (lossTensor) {
        try {
          loss.push(lossTensor.dataSync()[0]);
        } catch (e) {
          console.log("error recording loss", e);
        }
      }
    }
  }
}

export function useNodeStyle(id: string) {
  const session = useContext(SessionProivder);

  const blockInfo = session.session.network.blocks[id];
  const blockDefinition = Blocks[blockInfo?.type ?? ""];

  const baseStyle = {
    padding: 10,
    background: blockDefinition?.notDeletable ? "#2196f3" : "#fff",
    border:
      session.session.selectedBlockId == id
        ? "1px solid #0dd"
        : "1px solid #ddd",
    width: NODE_WIDTH,
    height: "200px",
  };

  return baseStyle;
}
