import { BlockClass } from "./BlockClass";

export class ConstantBlock extends BlockClass {
  constructor(id: string) {
    super(id, false);
  }
}
