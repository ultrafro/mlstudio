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
    intermediaryOutputs[blockId + "|out0|"] = output;

    const additionalOutputs = block.getAdditionalOutputs();
    for (const key in additionalOutputs) {
      intermediaryOutputs[blockId + key] = additionalOutputs[key];
    }
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
      const hash = connection.source + connection.sourceHandle;
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

export function backwardBlocks(
  id: string,
  network: Network,
  optimizerConfig: OptimizerConfig,
  iterations: number
) {
  let intermediate: Record<string, tf.Tensor<tf.Rank>> = {};

  const loss = () => {
    intermediate = forwardBlocks(network);

    const outputTensor = ActualBlocks[id].finalResultForTraining;

    if (!outputTensor) {
      console.log("no training output tensor for block", id);
    }
    return outputTensor;
  };

  const { value, grads } = tf.variableGrads(loss as any); // gradient of f as respect of each variable

  const calculateGrdds = tf.grads(forwardBlocks);

  const calculateGrads = tf.grad(loss as any);
  const grads2 = calculateGrads(ActualBlocks["|5|"].internalTensor as any);

  debugger;

  // const allGrads = tf.grads(loss, [var])[0]

  const optimizer = tf.train.sgd(0.1); // Stochastic Gradient Descent with learning rate 0.01

  optimizer.applyGradients(grads);

  //redistribute grads back into blocks for future inspection
  for (const key in grads) {
    const block = ActualBlocks[key];
    block.saveGrad(grads[key]);
  }
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
