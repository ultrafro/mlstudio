export const BASIC_WORFKLOW_GRAPH = {
  blocks: {
    "|FinalLoss|": {
      id: "|FinalLoss|",
      type: "FINAL_LOSS",
      x: 1820.050615418978,
      y: 497.7314575950511,
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
      x: 1361.45877769432,
      y: 607.1394040102356,
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
      x: 1369.9539859061408,
      y: 353.72562645125413,
    },
    "|ukVMn0qS5ANMTGhQhByNp|": {
      id: "|ukVMn0qS5ANMTGhQhByNp|",
      type: "MULTIPLY",
      x: 1592.175491045356,
      y: 497.38509440966436,
    },
    "|2jOIsySECbTbKTd7aOqkK|": {
      id: "|2jOIsySECbTbKTd7aOqkK|",
      type: "VARIABLE",
      x: 650.2100448272797,
      y: 193.46576872461577,
    },
    "|oiQfdN88wBxcyOEY0Fcpd|": {
      id: "|oiQfdN88wBxcyOEY0Fcpd|",
      type: "MULTIPLY",
      x: 1002.5517427682437,
      y: 596.2196296718186,
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
    "|oiQfdN88wBxcyOEY0Fcpd|_|out0|_|OUTPUT|_|in0|": {
      source: "|oiQfdN88wBxcyOEY0Fcpd|",
      sourceHandle: "|out0|",
      target: "|OUTPUT|",
      targetHandle: "|in0|",
    },
    "|2jOIsySECbTbKTd7aOqkK|_|out0|_|oiQfdN88wBxcyOEY0Fcpd|_|in1|": {
      source: "|2jOIsySECbTbKTd7aOqkK|",
      sourceHandle: "|out0|",
      target: "|oiQfdN88wBxcyOEY0Fcpd|",
      targetHandle: "|in1|",
    },
    "|INPUT|_|out0|_|oiQfdN88wBxcyOEY0Fcpd|_|in0|": {
      source: "|INPUT|",
      sourceHandle: "|out0|",
      target: "|oiQfdN88wBxcyOEY0Fcpd|",
      targetHandle: "|in0|",
    },
  },
};
