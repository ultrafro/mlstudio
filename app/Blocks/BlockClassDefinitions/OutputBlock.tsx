import * as tf from "@tensorflow/tfjs";
import { Tensor, Rank } from "@tensorflow/tfjs";
import { BlockClass } from "../BlockClass";
import { BlockType } from "../../model";

export class OutputBlock extends BlockClass {
  type = BlockType.OUTPUT;
  value = tf.tensor1d([2]);

  constructor(id: string) {
    super(id, false);
  }

  forward = (inputs: Tensor[]): Tensor => {
    return inputs.length > 0 ? inputs[0] : this.value;
  };
}
