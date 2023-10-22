import * as tf from "@tensorflow/tfjs";
import { Blocks, Network, OptimizerConfig } from "../model";
import { BlockClass } from "./BlockClass";

export const ActualBlocks: Record<string, BlockClass> = {};

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

export function forwardBlocks(network: Network) {
  //get a list of the blocks, sorted with leafs first
  const sortedBlockList = getSortedBlockIds(network);

  //clear the model
  //loop over each block, create list for inputs, call forward on that list

  const intermediaryOutputs: Record<string, tf.Tensor> = {};

  for (const blockId of sortedBlockList) {
    const block = ActualBlocks[blockId];

    const inputs: tf.Tensor[] = [];

    const definition = Blocks[block.type];
    if (definition.nodeType == "source") {
    }
    if (definition.nodeType == "unary") {
      const targetHandles = ["|in0|"];
      const targetId = blockId;

      for (const targetHandleId of targetHandles) {
        //find connection with targetId and targetHandleId
        const connection = Object.values(network.connections).find(
          (connection) => {
            return (
              connection.target == targetId &&
              connection.targetHandle == targetHandleId
            );
          }
        );

        if (!!connection) {
          const hash = connection.source + connection.sourceHandle;
          const input = intermediaryOutputs[hash];
          inputs.push(input);
        }
      }
    }
    if (definition.nodeType == "binary") {
      const targetHandles = ["|in0|", "|in1|"];
      const targetId = blockId;

      for (const targetHandleId of targetHandles) {
        //find connection with targetId and targetHandleId
        const connection = Object.values(network.connections).find(
          (connection) => {
            return (
              connection.target == targetId &&
              connection.targetHandle == targetHandleId
            );
          }
        );

        if (!!connection) {
          const hash = connection.source + connection.sourceHandle;
          const input = intermediaryOutputs[hash];
          inputs.push(input);
        }
      }
    }

    const output = block.forward(inputs);
    const additionalOutputs = block.getAdditionalOutputs();

    //save output to intermediaryOutputs
    intermediaryOutputs[blockId + "|out0|"] = output;
    for (const key in additionalOutputs) {
      intermediaryOutputs[blockId + key] = additionalOutputs[key];
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

  // return 0;
}

export function backwardBlocks(
  id: string,
  optimizerConfig: OptimizerConfig,
  iterations: number
) {}

export function useBlocks() {
  return ActualBlocks;
}

export const tensorflowTest3 = async () => {
  const a = tf.variable(tf.tensor1d([1]), true, "a");

  const forward = (x: tf.Tensor) => {
    const pred = x.mul(a);
    return pred;
  };

  const loss = (x: tf.Tensor, y: tf.Tensor) => {
    const pred = forward(x);
    return pred.sub(y).square().mean();
  };

  const x = tf.randomUniform([1, 2], 0, 1);
  const y = x.mul(2);

  for (let i = 0; i < 100; i++) {
    const lossFunction = () => {
      return loss(x, y);
    };

    const { value, grads } = tf.variableGrads(lossFunction as any); // gradient of f as respect of each variable

    const optimizer = tf.train.sgd(0.1); // Stochastic Gradient Descent with learning rate 0.01

    optimizer.applyGradients(grads);

    console.log("grads", grads.a.dataSync());

    console.log("loss at: " + i + ": " + value.dataSync());
  }

  console.log("new value for a: " + a.dataSync());
};
