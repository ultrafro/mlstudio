import { BlockType } from "../model";
import { BlockClass } from "./BlockClass";

export class LinearBlock extends BlockClass {
  type = BlockType.LINEAR;

  constructor(id: string) {
    super(id, false);
  }
}
