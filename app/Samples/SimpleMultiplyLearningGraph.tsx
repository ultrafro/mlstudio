export const SIMPLE_MULTIPLY_LEARNING_GRAPH = {
  blocks: {
    "|FinalLoss|": {
      id: "|FinalLoss|",
      type: "FINAL_LOSS",
      x: 2325.972789879535,
      y: 631.2094974876255,
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
      x: 1520.9580121042418,
      y: 772.2840825935089,
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
      x: 1480.2741365074835,
      y: 467.4993509791933,
    },
    "|2jOIsySECbTbKTd7aOqkK|": {
      id: "|2jOIsySECbTbKTd7aOqkK|",
      type: "VARIABLE",
      x: 827.2418810320083,
      y: 858.0233510380223,
      params: {
        shape: [1],
      },
    },
    "|oiQfdN88wBxcyOEY0Fcpd|": {
      id: "|oiQfdN88wBxcyOEY0Fcpd|",
      type: "MULTIPLY",
      x: 1052.5517427682437,
      y: 614.2196296718186,
    },
    "|eFAcCs1f9U9naiEkcPcnk|": {
      id: "|eFAcCs1f9U9naiEkcPcnk|",
      type: "VECTORIZE",
      x: 693.2761052775799,
      y: 602.2050525200834,
    },
    "|h3ENqtt7JAPa0kCJ29GpD|": {
      id: "|h3ENqtt7JAPa0kCJ29GpD|",
      type: "SQUARE_LOSS",
      x: 1873.3710531005445,
      y: 615.9097816878547,
    },
  },
  connections: {
    "|DATA_IN|_|out0|_|INPUT|_|in0|": {
      source: "|DATA_IN|",
      sourceHandle: "|out0|",
      target: "|INPUT|",
      targetHandle: "|in0|",
    },
    "|INPUT|_|out0|_|eFAcCs1f9U9naiEkcPcnk|_|in0|": {
      source: "|INPUT|",
      sourceHandle: "|out0|",
      target: "|eFAcCs1f9U9naiEkcPcnk|",
      targetHandle: "|in0|",
    },
    "|2jOIsySECbTbKTd7aOqkK|_|out0|_|oiQfdN88wBxcyOEY0Fcpd|_|in0|": {
      source: "|2jOIsySECbTbKTd7aOqkK|",
      sourceHandle: "|out0|",
      target: "|oiQfdN88wBxcyOEY0Fcpd|",
      targetHandle: "|in0|",
    },
    "|eFAcCs1f9U9naiEkcPcnk|_|out0|_|oiQfdN88wBxcyOEY0Fcpd|_|in1|": {
      source: "|eFAcCs1f9U9naiEkcPcnk|",
      sourceHandle: "|out0|",
      target: "|oiQfdN88wBxcyOEY0Fcpd|",
      targetHandle: "|in1|",
    },
    "|DATA_OUT|_|out0|_|h3ENqtt7JAPa0kCJ29GpD|_|in1|": {
      source: "|DATA_OUT|",
      sourceHandle: "|out0|",
      target: "|h3ENqtt7JAPa0kCJ29GpD|",
      targetHandle: "|in1|",
    },
    "|h3ENqtt7JAPa0kCJ29GpD|_|out0|_|FinalLoss|_|in0|": {
      source: "|h3ENqtt7JAPa0kCJ29GpD|",
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
    "|OUTPUT|_|out0|_|h3ENqtt7JAPa0kCJ29GpD|_|in0|": {
      source: "|OUTPUT|",
      sourceHandle: "|out0|",
      target: "|h3ENqtt7JAPa0kCJ29GpD|",
      targetHandle: "|in0|",
    },
  },
};
