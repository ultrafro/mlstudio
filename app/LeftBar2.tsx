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
    <div className="flex items-center justify-center pointer-events-none absolute bottom-[50px] shadow-xl ">
      <div className="flex flex-col items-center bg-white p-4 shadow-lg rounded-md pointer-events-auto border  border-gray-100 p-4 rounded overflow-hidden">
        <p className="text-center">Blocks</p>
        <div className="flex flex-row flex-wrap overflow-auto w-[800px] h-[150px]">
          {Object.keys(Blocks).map((block) => {
            const blockDefinition = Blocks[block as BlockType];
            if (blockDefinition.notDeletable) {
              return null;
            }
            return (
              <ShadowButton
                key={blockDefinition.name}
                src={blockDefinition.icon}
                // src={"/icons/neuronIcon.png"}
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
