export class BlockClass {
  loadFromStorage: boolean;
  id: string;

  constructor(id: string, loadFromStorage: boolean) {
    this.id = id;
    this.loadFromStorage = loadFromStorage;
  }

  async initialize() {}

  destroy() {}
}
