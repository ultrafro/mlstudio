export const SIMPLE_TRAINING_GRAPH = {
  blocks: {
    "|0|": {
      id: "|0|",
      type: "RANDOM_NUMBERS",
      x: 108,
      y: 272,
    },
    "|2|": {
      id: "|2|",
      type: "VARIABLE",
      x: 104,
      y: 548,
    },
    "|4|": {
      id: "|4|",
      type: "CONSTANT",
      x: 112,
      y: -20,
    },
    "|3|": {
      id: "|3|",
      type: "MULTIPLY",
      x: 400,
      y: 128,
    },
    "|5|": {
      id: "|5|",
      type: "SQUARE_LOSS",
      x: 720,
      y: 200,
    },
    "|6|": {
      id: "|6|",
      type: "MULTIPLY",
      x: 400,
      y: 400,
    },
    "|7|": {
      id: "|7|",
      type: "FINAL_LOSS",
      x: 1000,
      y: 200,
    },
  },
  connections: {
    "|4|_|out0|_|3|_|in1|": {
      source: "|4|",
      sourceHandle: "|out0|",
      target: "|3|",
      targetHandle: "|in1|",
    },
    "|0|_|out0|_|3|_|in0|": {
      source: "|0|",
      sourceHandle: "|out0|",
      target: "|3|",
      targetHandle: "|in0|",
    },
    "|0|_|out0|_|6|_|in1|": {
      source: "|0|",
      sourceHandle: "|out0|",
      target: "|6|",
      targetHandle: "|in1|",
    },
    "|2|_|out0|_|6|_|in0|": {
      source: "|2|",
      sourceHandle: "|out0|",
      target: "|6|",
      targetHandle: "|in0|",
    },
    "|3|_|out0|_|5|_|in1|": {
      source: "|3|",
      sourceHandle: "|out0|",
      target: "|5|",
      targetHandle: "|in1|",
    },
    "|6|_|out0|_|5|_|in0|": {
      source: "|6|",
      sourceHandle: "|out0|",
      target: "|5|",
      targetHandle: "|in0|",
    },
    "|5|_|out0|_|7|_|in0|": {
      source: "|5|",
      sourceHandle: "|out0|",
      target: "|7|",
      targetHandle: "|in0|",
    },
  },
};
