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
  //clear the model
  //loop over each block, create list for inputs, call forward on that list
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
