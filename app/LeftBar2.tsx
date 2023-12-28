import { nanoid } from "nanoid";
import { FlexCol, FlexRow, Icon } from "./Flex";
import { SessionProivder } from "./Providers";
import { BlockType, Blocks, blocks } from "./model";
import { useContext } from "react";
import { ShadowButton } from "./CustomComponents/Button";
import { useCreateBlock } from "./utils";

export default function LeftBar2() {
  const session = useContext(SessionProivder);
  const createBlock = useCreateBlock();

  return (
    <div className="flex items-center justify-center absolute left-5 h-full pointer-events-none">
      <div className="flex flex-col items-center bg-white p-4 shadow-lg rounded-md pointer-events-auto">
        <p className="text-center">Blocks</p>
        <div className="flex flex-row flex-wrap overflow-auto w-[200px] h-[600px]">
          {Object.keys(Blocks).map((block) => {
            const blockDefinition = Blocks[block as BlockType];
            return (
              <ShadowButton
                key={blockDefinition.name}
                src={"/icons/neuronIcon.png"}
                label={blockDefinition.name}
                onClick={() => {
                  createBlock(block as BlockType);
                }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
