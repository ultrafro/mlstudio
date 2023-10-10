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

    console.log("loss at: " + i + ": " + value.dataSync());
  }

  console.log("new value for a: " + a.dataSync());
};

export const tensorflowTest2 = async () => {
  // Define the model and optimizer
  const model = tf.sequential();
  model.add(tf.layers.dense({ units: 1, inputShape: [1] }));

  const optimizer = tf.train.sgd(0.01); // Stochastic Gradient Descent with learning rate 0.01

  // Define training data
  const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
  const ys = tf.tensor2d([2, 4, 6, 8], [4, 1]);

  const A = tf.variable(tf.scalar(Math.random()), true, "A");

  // Training loop
  const numEpochs = 2;
  for (let epoch = 0; epoch < numEpochs; epoch++) {
    const predictions = xs.mul(A);
    const loss = predictions.sub(ys).square().mean();
    const gradResult = tf.variableGrads(() => loss as any, [A]);

    console.log("grad result");
    console.log(gradResult);

    // // Forward pass: Predictions
    // const predictions = model.predict(xs) as tf.Tensor<tf.Rank>;

    // // Compute the loss (mean squared error)
    // const loss = tf.losses.meanSquaredError(ys, predictions);

    // const gradResult = tf.variableGrads(()=>loss, []);

    // // Backpropagation: Compute gradients
    // const grads = tf.grads((xs, ys) => {
    //   const predictions = model.predict(xs) as tf.Tensor<tf.Rank>;
    //   const loss = tf.losses.meanSquaredError(ys, predictions);
    //   return loss;
    // });
    // const gradResults = grads([xs, ys]);

    // const { value: lossValue, grads: gradients } = grads([xs, ys]);

    // // Update model weights
    // optimizer.applyGradients(gradients);

    // console.log(
    //   `Epoch ${epoch + 1}/${numEpochs}, Loss: ${lossValue.dataSync()}`
    // );
  }

  // // Make a prediction
  // const testInput = tf.tensor2d([5], [1, 1]);
  // const prediction = model.predict(testInput);
  // console.log(`Prediction for input 5: ${prediction.dataSync()[0]}`);
};

export const tensorflowTest = async () => {
  const x = tf.tensor2d([[1.0, 2.0]]);
  const y = tf.tensor2d([[2.0, 4.0]]);

  // Create a variable
  const a = tf.variable(tf.scalar(Math.random()), true, "a");

  console.log("initial value of multiplier");
  console.log(a.dataSync());

  const yPred = tf.variable(a.mul(x), true, "yPred");
  console.log("predicted y");
  console.log(yPred.dataSync());

  const lossFunction = () => {
    return yPred.sub(y).square().mean();
  };

  const vars = [a, yPred];

  const learningRate = 0.01;
  const optimizer = tf.train.sgd(learningRate);

  for (let i = 0; i < 200; i++) {
    const result = optimizer.computeGradients(lossFunction as any, vars);

    console.log("loss: " + result.value);

    for (const tensorId in result.grads) {
      const val = result.grads[tensorId].dataSync();
      console.log("grad for: " + tensorId + " " + val);
    }

    //console.log("applying gradients");
    const gradMultipliers: Record<string, number> = {};
    for (const variable of vars) {
      gradMultipliers[variable.name] = -1;
    }

    optimizer.applyGradients(gradMultipliers as any);
  }

  console.log("new value of multiplier");
  console.log(a.dataSync());

  // const loss = tf.variable(yPred.sub(y).square().mean(), true);
  // console.log("loss");
  // console.log(await loss.data());

  // // Define the loss function
  // function lossFunction() {
  //   const yPred = a.mul(x);
  //   console.log("initial result");
  //   console.log(yPred.print());
  //   const loss = yPred.sub(y).square().mean();
  //   return loss;
  // }

  //const result = optimizer.minimize(lossFunction as any, true, [a, b]);

  // console.log("starting contraption");
  // const result = await new Promise<any>(async (res) => {
  //   const vals: Promise<any>[] = [];

  //   const testLoss = () => {
  //     console.log("running loss!");
  //     const yPred = a.mul(x);
  //     console.log("initial result");
  //     console.log(yPred.print());
  //     const loss = yPred.sub(y).square().mean();

  //     vals.push(yPred.data());
  //     vals.push(loss.data());

  //     console.log("almost done with loss");
  //     return loss;
  //   };

  //   console.log("forward");

  //   // const result = optimizer.computeGradients(testLoss as any, [a]);
  //   const result = optimizer.computeGradients(
  //     () => yPred.sub(y).square().mean() as any,
  //     [yPred, a]
  //   );

  //   await Promise.all(vals);

  //   res(result);
  // });
  // console.log("done with contraption");

  // console.log("loss: " + result.value);

  // for (const tensorId in result.grads) {
  //   const val = await result.grads[tensorId].data();
  //   console.log("grad for: " + tensorId + " " + val);
  // }

  // console.log("applying gradients");
  // optimizer.applyGradients(result.grads);

  // console.log("grads");
  // for (const tensor of Object.values(result.grads)) {
  //   console.log(tensor.print());
  // }

  // console.log("vals");
  // for (const tensor of Object.values(result.value)) {
  //   console.log(tensor);
  // }

  // // Train the model
  // for (let i = 0; i < numIterations; i++) {
  //   optimizer.minimize(lossFunction, true, [a, b]);
  // }

  // const x = tf.tensor2d([[1.0, 2.0]]);
  // const yTrue = tf.tensor2d([[3.0, 4.0]]);
  // const W = tf.variable(tf.randomNormal([2, 2]));
  // const b = tf.variable(tf.zeros([1, 2]));

  // console.log(W.print());

  // const test = W.add(b);

  // // // Define the model and loss function
  // const yPred = x.matMul(W).add(b);
  // const loss = yTrue.sub(yPred).square().mean();

  // console.log("loss");
  // console.log(loss.print());

  // const lossScalar = tf.mean(loss);

  // // // Create an instance of the optimizer
  // const learningRate = 0.01;
  // const optimizer = tf.train.sgd(learningRate);

  // const result = optimizer.computeGradients(() => loss as any, [W]);
  // console.log("result");
  // console.log(result);

  // // Compute the gradients and apply them to the model parameters

  // optimizer
  //   .minimize(() => loss, [W, b])
  //   .then(() => {
  //     // To print the updated values of W and b
  //     W.print();
  //     b.print();
  //   });

  // # Define the model and loss function
  // x = tf.constant([[1.0, 2.0]])
  // y_true = tf.constant([[3.0, 4.0]])
  // W = tf.Variable(tf.random.normal([2, 2]))
  // b = tf.Variable(tf.zeros([1, 2]))
  // y_pred = tf.matmul(x, W) + b
  // loss = tf.reduce_mean(tf.square(y_true - y_pred))
  // # Create an instance of the optimizer
  // optimizer = tf.optimizers.SGD(learning_rate=0.01)
  // # Compute the gradients and apply them to the model parameters
  // grads_and_vars = optimizer.compute_gradients(loss, [W, b])
  // optimizer.apply_gradients(grads_and_vars)
};
