export type block = {
  name: string;
  icon: string;
};

export const tensorBlock: block = {
  name: "Tensor",
  icon: "icons/run.png",
};

export const blocks: block[] = [tensorBlock, tensorBlock];
