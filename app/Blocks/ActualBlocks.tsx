import * as tf from "@tensorflow/tfjs";
import {
  BlockType,
  Blocks,
  Network,
  OptimizerConfig,
  SupervisedDataShape,
} from "../model";
import { BlockClass } from "./BlockClass";
import { actualData } from "./ActualData";

export const ActualBlocks: Record<string, BlockClass> = {};

type BlockExecution = {
  id: string;
  inputs: string[];
  func: (inputs: tf.Tensor[], sample?: boolean) => tf.Tensor;
};

export async function initializeBlocks(network: Network, clear?: boolean) {
  if (clear) {
    for (const key in ActualBlocks) {
      const block = ActualBlocks[key];
      block.destroy();
      delete ActualBlocks[key];
    }
  }

  const alreadyStoredKeys = Object.keys(ActualBlocks);

  for (const key in network.blocks) {
    const blockDef = network.blocks[key];

    if (!alreadyStoredKeys.includes(blockDef.id)) {
      const classDef = Blocks[blockDef.type].classDef;
      const blockClass = new classDef(blockDef.id, !!clear);

      await blockClass.initialize();

      ActualBlocks[blockDef.id] = blockClass;
    }
  }
}

function getInputTensors(
  blockId: string,
  network: Network,
  intermediaryOutputs: Record<string, tf.Tensor>
): { inputs: tf.Tensor[]; inputHashes: string[] } {
  const block = ActualBlocks[blockId];

  const inputs: tf.Tensor[] = [];
  const inputHashes: string[] = [];

  const definition = Blocks[block.type];
  if (definition.nodeType == "source") {
  }
  if (definition.nodeType == "unary") {
    const targetHandles = ["|in0|"];
    gatherInputs(
      targetHandles,
      blockId,
      network,
      inputs,
      inputHashes,
      intermediaryOutputs
    );
  }
  if (definition.nodeType == "binary") {
    const targetHandles = ["|in0|", "|in1|"];
    gatherInputs(
      targetHandles,
      blockId,
      network,
      inputs,
      inputHashes,
      intermediaryOutputs
    );
  }
  if (definition.nodeType == "target") {
    const targetHandles = ["|in0|"];
    gatherInputs(
      targetHandles,
      blockId,
      network,
      inputs,
      inputHashes,
      intermediaryOutputs
    );
  }

  return { inputs, inputHashes };
}

export function forwardBlocks(network: Network): Record<string, tf.Tensor> {
  //get a list of the blocks, sorted with leafs first
  const sortedBlockList = getSortedBlockIds(network);

  const intermediaryOutputs: Record<string, tf.Tensor> = {};

  // for (const step of steps) {
  for (const blockId of sortedBlockList) {
    const { inputs, inputHashes } = getInputTensors(
      blockId,
      network,
      intermediaryOutputs
    );

    const block = ActualBlocks[blockId];
    const output = block.forward(inputs);
    tf.keep(output);

    intermediaryOutputs[blockId] = output;

    // intermediaryOutputs[blockId + "|out0|"] = output;

    // const additionalOutputs = block.getAdditionalOutputs();
    // for (const key in additionalOutputs) {
    //   intermediaryOutputs[blockId + key] = additionalOutputs[key];
    // }
  }

  return intermediaryOutputs;
}

function gatherInputs(
  handleIds: string[],
  blockId: string,
  network: Network,
  inputs: tf.Tensor[],
  inputHashes: string[],
  intermediaryOutputs: Record<string, tf.Tensor>
) {
  const targetId = blockId;

  for (const targetHandleId of handleIds) {
    //find connection with targetId and targetHandleId
    const connection = Object.values(network.connections).find((connection) => {
      return (
        connection.target == targetId &&
        connection.targetHandle == targetHandleId
      );
    });

    if (!!connection) {
      // const hash = connection.source + connection.sourceHandle;
      const hash = connection.source;
      const input = intermediaryOutputs[hash];
      inputs.push(input);
      inputHashes.push(hash);
    }
  }
}

function getSortedBlockIds(network: Network): string[] {
  const ids = Object.keys(network.blocks);

  const sortedIds = [];

  let tempBlockHolder = [...ids];

  for (let i = 0; i < ids.length; i++) {
    const idsToRemoveFromTempBlockHolder: string[] = [];
    for (let j = 0; j < tempBlockHolder.length; j++) {
      const id = tempBlockHolder[j];
      //loop over tempblockholder, if block has no inputs, add to sortedIds, remove from tempBlockHolder

      const numInputs = getNumberOfInputs(id, tempBlockHolder, network);
      if (numInputs == 0) {
        sortedIds.push(id);
        idsToRemoveFromTempBlockHolder.push(id);
      }
    }

    tempBlockHolder = tempBlockHolder.filter(
      (id) => !idsToRemoveFromTempBlockHolder.includes(id)
    );

    if (sortedIds.length == ids.length) {
      break;
    }
  }

  if (sortedIds.length != ids.length) {
    console.log(
      "SOMETHING WENT WRONG WITH SORTING NETWORK",
      network,
      ids,
      sortedIds
    );
  }

  return sortedIds;
}

export function getSortedBlockIdsUpToAndIncluding(
  network: Network,
  id: string
): string[] {
  const result: string[] = [];

  const allSortedIds = getSortedBlockIds(network);

  //find all ids that are ancestors of id
  const ancestors: Record<string, boolean> = { [id]: true };
  getAncestors(id, ancestors, network);

  const acestorIdList = Object.keys(ancestors);

  for (const sortedId of allSortedIds) {
    if (acestorIdList.includes(sortedId)) {
      result.push(sortedId);
    }
  }

  return result;
}

export function getBrokenBlocksList(network: Network): string[] {
  const brokenBlockList: string[] = [];

  //evaluate every block to see if its inputs are correct
  for (const block of Object.values(network.blocks)) {
    const ancestors = getSortedBlockIdsUpToAndIncluding(network, block.id);

    const blockStats: Record<
      string,
      { correct: boolean; outputShape: number[] | null }
    > = {};

    for (const ancestorId of ancestors) {
      const ancestorBlock = network.blocks[ancestorId];
      const actualBlock = ActualBlocks[ancestorId];
      if (actualBlock) {
        const inputBlocks: string[] = [];
        for (const connectionId in network.connections) {
          const connection = network.connections[connectionId];
          if (connection.target == ancestorId) {
            inputBlocks.push(connection.source);
          }
        }

        const inputShapes: (number[] | null)[] = [];
        for (const inputBlock of inputBlocks) {
          const inputBlockStats = blockStats[inputBlock];
          if (inputBlockStats) {
            inputShapes.push(inputBlockStats.outputShape);
          } else {
            brokenBlockList.push(ancestorId);
            break;
          }
        }

        const correct = actualBlock.areInputsCorrect(inputShapes);

        const outputShape = actualBlock.getOutputShape(inputShapes);

        blockStats[ancestorId] = { correct, outputShape };
      } else {
        brokenBlockList.push(ancestorId);
        break;
      }
    }
  }

  return brokenBlockList;
}

function getAncestors(
  id: string,
  ancestorHolder: Record<string, boolean>,
  network: Network
) {
  const connections = Object.values(network.connections).filter(
    (connection) => {
      return connection.target == id;
    }
  );

  for (const connection of connections) {
    ancestorHolder[connection.source] = true;
    getAncestors(connection.source, ancestorHolder, network);
  }
}

function getNumberOfInputs(
  blockId: string,
  eligibleBlocks: string[],
  network: Network
): number {
  //loop through edges and see how many are in eligibleBlocks
  const connectionsTargetingBlock = Object.values(network.connections).filter(
    (connection) => {
      return connection.target == blockId;
    }
  );

  const eligibleConnections = connectionsTargetingBlock.filter((connection) => {
    return eligibleBlocks.includes(connection.source);
  });

  return eligibleConnections.length;
}

function GetBlockExecutions(network: Network): BlockExecution[] {
  const result: BlockExecution[] = [];

  const sortedBlockList = getSortedBlockIds(network);

  const intermediaryOutputs: Record<string, tf.Tensor> = {};

  for (const blockId of sortedBlockList) {
    const newExecution: BlockExecution = {
      id: blockId,
      inputs: [],
      func: (inputs: tf.Tensor[]) => {
        return inputs[0];
      },
    };

    const { inputs, inputHashes } = getInputTensors(
      blockId,
      network,
      intermediaryOutputs
    );

    newExecution.inputs = inputHashes;

    const block = ActualBlocks[blockId];
    newExecution.func = block.forward;

    result.push(newExecution);
  }

  return result;
}

function getLossAndIntermediates(
  executions: BlockExecution[],
  overWriteId?: string,
  overWriteTensor?: tf.Tensor,
  sample?: boolean
): {
  loss: tf.Tensor;
  intermediates: Record<string, tf.Tensor>;
} {
  let outputId: string | null = null;

  const intermediaryOutputs: Record<string, tf.Tensor> = {};
  for (const execution of executions) {
    const blockId = execution.id;

    const inputs: tf.Tensor[] = [];
    for (const inputHash of execution.inputs) {
      inputs.push(intermediaryOutputs[inputHash]);
    }
    const output = execution.func(inputs, sample);

    if (blockId == overWriteId) {
      intermediaryOutputs[blockId] = overWriteTensor as any;
    } else {
      intermediaryOutputs[blockId] = output;
    }

    if (ActualBlocks[blockId].type == BlockType.FINAL_LOSS) {
      outputId = blockId;
    }
  }

  if (outputId == null) {
    console.log("no output id found");
  }

  const outputTensor = intermediaryOutputs[outputId ?? ""];
  return { loss: outputTensor, intermediates: intermediaryOutputs };
}

export function trainBlocks(
  id: string,
  network: Network,
  optimizerConfig: OptimizerConfig,
  iterations: number
) {
  //get a data sample'
  actualData.newSample();

  const executions = GetBlockExecutions(network);

  const loss2 = () => {
    const { loss, intermediates } = getLossAndIntermediates(executions);
    return loss;
  };

  const { value, grads: variableGrads } = tf.variableGrads(loss2 as any); // gradient of f as respect of each variable

  const optimizer = tf.train.sgd(0.1); // Stochastic Gradient Descent with learning rate 0.01

  optimizer.applyGradients(variableGrads);

  const { loss: lossPrep, intermediates: intermediatePrep } =
    getLossAndIntermediates(executions, undefined, undefined, true);

  //loop through variables and save their value
  for (const execution of executions) {
    const blockId = execution.id;

    //if its not the final loss block:
    if (ActualBlocks[blockId].type != BlockType.FINAL_LOSS) {
      const blockValue = intermediatePrep[blockId];

      ActualBlocks[blockId].saveValue(blockValue);
    }
  }

  //loop through and calculate grad for each block
  for (const execution of executions) {
    const blockId = execution.id;

    //if its not the final loss block:
    if (ActualBlocks[blockId].type != BlockType.FINAL_LOSS) {
      let blockValue = intermediatePrep[blockId];

      const lossFromBlock = (blockValue: tf.Tensor): tf.Tensor => {
        const { loss, intermediates } = getLossAndIntermediates(
          executions,
          blockId,
          blockValue
        );
        return loss;
      };

      const calculateGrads = tf.valueAndGrad(lossFromBlock);
      const stuff = calculateGrads(blockValue);

      ActualBlocks[blockId].saveGrad(stuff.grad);
    }
  }

  // //loop through all blocks and print their values and grads
  // for (const execution of executions) {
  //   const blockId = execution.id;

  //   const block = ActualBlocks[blockId];

  //   console.log(
  //     "block: " + blockId,
  //     block.getValue()?.dataSync(),
  //     block.getGrads()?.dataSync()
  //   );
  // }
}

export function useBlocks() {
  return ActualBlocks;
}

export const tensorflowTest3 = async () => {
  const a = tf.variable(tf.tensor1d([1]), true, "bac");

  const forward = (x: tf.Tensor) => {
    const pred = x.mul(a);
    return pred;
  };

  const loss = (x: tf.Tensor, y: tf.Tensor) => {
    const pred = forward(x);
    const result = pred.sub(y).square().mean();
    return result;
    // return pred.sub(y).square().mean();
  };

  const x = tf.randomUniform([1, 2], 0, 1);
  const y = x.mul(2);

  const lossFunction = () => {
    return loss(x, y);
  };

  for (let i = 0; i < 100; i++) {
    // const lossFunction = () => {
    //   return loss(x, y);
    // };

    const { value, grads } = tf.variableGrads(lossFunction as any); // gradient of f as respect of each variable

    const optimizer = tf.train.sgd(0.1); // Stochastic Gradient Descent with learning rate 0.01

    optimizer.applyGradients(grads);

    console.log("grads", grads.bac.dataSync());

    console.log("loss at: " + i + ": " + value.dataSync());
  }

  console.log("new value for a: " + a.dataSync());
};
