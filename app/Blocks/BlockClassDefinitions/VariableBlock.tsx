import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockParams, BlockType } from "../../model";
import VariableBlockEditor from "../BlockEditors/VariableBlockEditor";

export class VariableBlock extends BlockClass {
  type = BlockType.VARIABLE;

  variable = tf.variable(tf.tensor1d([Math.random()]), true);

  constructor(id: string, loadFromStorage: boolean) {
    super(id, false);
    this.variable.dispose();

    console.log("SETTING UP VARIABLE: " + id);
    this.variable = tf.variable(tf.tensor1d([Math.random()]), true, id);
  }

  override initialize = (params?: BlockParams): void => {
    const initialScale = 0.01;
    this.variable.dispose();
    const size = this.currentParams["shape"] as number[];
    if (!size) {
      this.variable = tf.variable(
        tf.tensor1d([Math.random() * initialScale]),
        true,
        this.id
      );
    } else {
      this.variable = tf.variable(
        tf.mul(tf.randomNormal(size as any), tf.scalar(initialScale)),
        true,
        this.id
      );
    }
  };

  forward = (inputs: Tensor[]): Tensor => {
    return this.variable;
  };

  override getOutputShape = (inputs: (number[] | null)[]): number[] | null => {
    return this.variable?.shape ?? null;
  };

  override areInputsCorrect = (
    inputs: (number[] | null)[]
  ): { correct: boolean; reason?: string } => {
    return { correct: true };
  };

  override saveValue(value: Tensor) {
    //dont do anything
  }

  override saveGrad(grads: Tensor) {
    this.grads = grads;
  }

  //some blocks, like multiply, don't have state
  override getValue(): Tensor | null {
    return this.variable ?? null;
  }

  override getGrads(): Tensor | null {
    return this.grads ?? null;
  }

  override getWeights(): tf.Variable[] | null {
    return [this.variable];
  }

  override render = () => {
    return <VariableBlockEditor id={this.id} />;
  };

  override destroy = () => {
    super.destroy();
    this.variable.dispose();
  };
}
