export const basicLinearGraph = {
  blocks: {
    "|FinalLoss|": {
      id: "|FinalLoss|",
      type: "FINAL_LOSS",
      x: 2353.686693907807,
      y: 212.6623477880944,
    },
    "|INPUT|": {
      id: "|INPUT|",
      type: "INPUT",
      x: -455.826800264359,
      y: 191.79837250899106,
    },
    "|OUTPUT|": {
      id: "|OUTPUT|",
      type: "OUTPUT",
      x: 1766.3181595629262,
      y: 332.5169009628323,
    },
    "|DATA_IN|": {
      id: "|DATA_IN|",
      type: "DATA_IN",
      x: -801.0588108422771,
      y: 185.78055172592144,
    },
    "|DATA_OUT|": {
      id: "|DATA_OUT|",
      type: "DATA_OUT",
      x: 1759.5900643949699,
      y: -17.343483355702574,
    },
    "|eFAcCs1f9U9naiEkcPcnk|": {
      id: "|eFAcCs1f9U9naiEkcPcnk|",
      type: "VECTORIZE",
      x: -108.72389472242003,
      y: 188.20505252008343,
    },
    "|h3ENqtt7JAPa0kCJ29GpD|": {
      id: "|h3ENqtt7JAPa0kCJ29GpD|",
      type: "SQUARE_LOSS",
      x: 2065.0524580709493,
      y: 208.03551421993802,
    },
    "|aI9rb-9ymAuk2kIJ1Z_DD|": {
      id: "|aI9rb-9ymAuk2kIJ1Z_DD|",
      type: "SOFTMAX",
      x: 1313.3451136748045,
      y: 326.73526733177573,
    },
    "|mKzvGRVa4flQ2gyRO59U7|": {
      id: "|mKzvGRVa4flQ2gyRO59U7|",
      type: "LINEAR",
      x: 657.5023015332541,
      y: 225.17631116337878,
      params: {
        inputSize: 784,
        outputSize: 10,
      },
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
    "|DATA_OUT|_|out0|_|h3ENqtt7JAPa0kCJ29GpD|_|in1|": {
      source: "|DATA_OUT|",
      sourceHandle: "|out0|",
      target: "|h3ENqtt7JAPa0kCJ29GpD|",
      targetHandle: "|in1|",
    },
    "|OUTPUT|_|out0|_|h3ENqtt7JAPa0kCJ29GpD|_|in0|": {
      source: "|OUTPUT|",
      sourceHandle: "|out0|",
      target: "|h3ENqtt7JAPa0kCJ29GpD|",
      targetHandle: "|in0|",
    },
    "|h3ENqtt7JAPa0kCJ29GpD|_|out0|_|FinalLoss|_|in0|": {
      source: "|h3ENqtt7JAPa0kCJ29GpD|",
      sourceHandle: "|out0|",
      target: "|FinalLoss|",
      targetHandle: "|in0|",
    },
    "|aI9rb-9ymAuk2kIJ1Z_DD|_|out0|_|OUTPUT|_|in0|": {
      source: "|aI9rb-9ymAuk2kIJ1Z_DD|",
      sourceHandle: "|out0|",
      target: "|OUTPUT|",
      targetHandle: "|in0|",
    },
    "|eFAcCs1f9U9naiEkcPcnk|_|out0|_|mKzvGRVa4flQ2gyRO59U7|_|in0|": {
      source: "|eFAcCs1f9U9naiEkcPcnk|",
      sourceHandle: "|out0|",
      target: "|mKzvGRVa4flQ2gyRO59U7|",
      targetHandle: "|in0|",
    },
    "|mKzvGRVa4flQ2gyRO59U7|_|out0|_|aI9rb-9ymAuk2kIJ1Z_DD|_|in0|": {
      source: "|mKzvGRVa4flQ2gyRO59U7|",
      sourceHandle: "|out0|",
      target: "|aI9rb-9ymAuk2kIJ1Z_DD|",
      targetHandle: "|in0|",
    },
  },
};
