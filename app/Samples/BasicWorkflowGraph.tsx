export const BASIC_WORFKLOW_GRAPH = {
  blocks: {
    "|FinalLoss|": {
      id: "|FinalLoss|",
      type: "FINAL_LOSS",
      x: 1496.050615418978,
      y: 495.7314575950511,
    },
    "|INPUT|": {
      id: "|INPUT|",
      type: "INPUT",
      x: 458.173199735641,
      y: 607.7983725089911,
    },
    "|OUTPUT|": {
      id: "|OUTPUT|",
      type: "OUTPUT",
      x: 1037.45877769432,
      y: 605.1394040102356,
    },
    "|DATA_IN|": {
      id: "|DATA_IN|",
      type: "DATA_IN",
      x: 132.94118915772287,
      y: 609.7805517259214,
    },
    "|DATA_OUT|": {
      id: "|DATA_OUT|",
      type: "DATA_OUT",
      x: 1045.9539859061408,
      y: 351.72562645125413,
    },
    "|ukVMn0qS5ANMTGhQhByNp|": {
      id: "|ukVMn0qS5ANMTGhQhByNp|",
      type: "MULTIPLY",
      x: 1268.175491045356,
      y: 495.38509440966436,
    },
  },
  connections: {
    "|DATA_IN|_|out0|_|INPUT|_|in0|": {
      source: "|DATA_IN|",
      sourceHandle: "|out0|",
      target: "|INPUT|",
      targetHandle: "|in0|",
    },
    "|OUTPUT|_|out0|_|ukVMn0qS5ANMTGhQhByNp|_|in0|": {
      source: "|OUTPUT|",
      sourceHandle: "|out0|",
      target: "|ukVMn0qS5ANMTGhQhByNp|",
      targetHandle: "|in0|",
    },
    "|DATA_OUT|_|out0|_|ukVMn0qS5ANMTGhQhByNp|_|in1|": {
      source: "|DATA_OUT|",
      sourceHandle: "|out0|",
      target: "|ukVMn0qS5ANMTGhQhByNp|",
      targetHandle: "|in1|",
    },
    "|ukVMn0qS5ANMTGhQhByNp|_|out0|_|FinalLoss|_|in0|": {
      source: "|ukVMn0qS5ANMTGhQhByNp|",
      sourceHandle: "|out0|",
      target: "|FinalLoss|",
      targetHandle: "|in0|",
    },
  },
};
